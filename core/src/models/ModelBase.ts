import axios from 'axios';
import * as qs from 'qs';
import { pgClient } from '../common/PgConnection';
import { NatsConnection } from "nats";

const NATS = require('nats');
const NATS_URL = process.env.NATS;

// NATS CONNECTION OBJECT
var nc: NatsConnection;

function initialize() {
    Parse.initialize(
        process.env.APP_ID || 'APP_ID',
        process.env.JAVASCRIPT_KEY || 'JAVASCRIPT_KEY',
        process.env.MASTER_KEY || 'MASTER_KEY'
    );
    // @ts-ignore
    Parse.serverURL = process.env.SERVER_URL || "http://localhost:1337/parse";
    return Parse;
}

initialize();

const connectNats = async () => {
    while (true) {
        try {
            console.log('trying to connect to nats server');
            nc = await NATS.connect({ servers: NATS_URL })
            break;
        } catch (error) {
            console.log(error);
        }
    }
}
export interface ComplexTypeData {
    columnName: string
    className: string
    shouldIgnore: boolean
}

export interface IModelBase {
    fetchAscendToken(): any
    syncWithAscend(): void
}

const MASTER_KEY_OPTION = { useMasterKey: true }
export abstract class ModelBase<T extends Parse.Attributes> extends Parse.Object<T> implements IModelBase {

    ascendEndpoint: string = '';
    baseUrl: string = 'https://prod.hs1api.com/ascend-gateway/api';
    useLastId: boolean = true;
    lastId: string = '';
    className: any = '';
    simpleTypes: any[] = [];
    complexTypes: any[] = [];

    async updateLastId(): Promise<void> {
        const ParseClassObject = Parse.Object.extend(this.className);
        const query = new Parse.Query(ParseClassObject);
        query.limit(1).exists("ascend_id").descending("ascend_id");
        const results = await query.find(MASTER_KEY_OPTION);

        if (results.length !== 0) {
            this.lastId = results[0].get('ascend_id');
        }
    }

    async getAllFromAscend(ascendEndpoint: string, complexTypes: ComplexTypeData[], parseClass: any, simpleTypes: any[] = []): Promise<any> {
        console.log(`getAllFromAscend ${ascendEndpoint}`)

        let newEntries = [];

        try {
            await pgClient.connect();
        } catch (pgClientError) {
            // console.log(pgClientError);
        }

        try {
            let page = 1;
            await this.updateLastId();
            console.log(`${this.className} lastId : ${this.lastId}`);
            while (true) {
                const tokenObject = await this.fetchAscendToken();
                try {
                    const url = `${this.baseUrl}${ascendEndpoint}?pageSize=500${!!this.useLastId ? '&lastId=' + this.lastId : ''}`;
                    console.log(`ASCEND REQUEST > ${url}`)
                    const response: any = await axios({
                        method: 'get',
                        url: url,
                        headers: {
                            'Organization-ID': '5fd1407ae6c7d408cb4fdb60',
                            'Authorization': `Bearer ${tokenObject.access_token}`
                        },
                        data: qs.stringify({})
                    });

                    const objects = response.data.data;

                    if (objects.length) {
                        this.lastId = objects[objects.length - 1].id;
                    }
                    console.log(`page# ${page} - found ${objects.length} new items - total migrated ${newEntries.length} - ${ascendEndpoint}`);

                    for (var x = 0; x < objects.length; x++) {

                        const obj = objects[x];

                        delete obj['type'];


                        // swap id with ascend_id
                        obj['ascendSyncCompleted'] = true;
                        obj['ascend_id'] = String(obj['id']);
                        delete obj['id'];

                        for (let x = 0; x < complexTypes.length; x++) {
                            const t = complexTypes[x];
                            obj[`${t.columnName}_ascend`] = obj[t.columnName];
                            delete obj[t.columnName];
                        }

                        for (let x = 0; x < simpleTypes.length; x++) {
                            const t = simpleTypes[x];
                            obj[`${t.columnName}_ascend`] = obj[t.columnName];
                            if (!!obj[t.columnName]) {
                                obj[t.columnName] = new Date(obj[t.columnName]);
                            }
                        }

                        try {
                            obj['generatedBy'] = 'ascend'
                            obj['lastUpdatedBy'] = 'ascend'

                            const parseObject = new parseClass(obj);
                            await parseObject.save(null, MASTER_KEY_OPTION);
                            newEntries.push(parseObject);
                        } catch (error) {
                            console.log(error);
                        }
                    }

                    if (objects.length >= 500) {
                        page++;
                    } else {
                        break;
                    }
                } catch (error) {
                    console.log(`Error while fetching ${this.className} page number : ${page}, \nERROR MESSAGE : ${error} \nretrying ...`)
                }
            }

            // update all parse object ids to match dentix asecend 
            try {
                if (newEntries.length) {
                    console.log(`REMOVING DUPLICATED OBJECTS for ${this.className}`)
                    const removeDuplicatesQuery = `DELETE FROM public."${this.className}"
                    WHERE "objectId" IN 
                    (SELECT "objectId"
                    FROM (SELECT "objectId",
                            ROW_NUMBER() OVER (partition BY ascend_id ORDER BY "objectId") AS RowNumber
                        FROM public."${this.className}") AS T
                    WHERE T.RowNumber > 1)
                    and "migrationStatus"='COMPLETE';`
                    await pgClient.query(removeDuplicatesQuery);

                    console.log(`UPDATING PARSE OBJECT IDs for ${this.className}`)

                    let newEntriesObjectIdQuery = ' OR '
                    for (let x = 0; x < newEntries.length; x++) {
                        newEntriesObjectIdQuery += `"objectId" = '${newEntries[x].id}' OR `;
                    }

                    newEntriesObjectIdQuery = newEntriesObjectIdQuery.substring(0, newEntriesObjectIdQuery.length - 3);

                    const updateQuery = `Update public."${this.className}" SET "objectId"="ascend_id" WHERE "ascend_id" is not null and "objectId" is distinct from "ascend_id" ${newEntriesObjectIdQuery};`
                    console.log(updateQuery);
                    await pgClient.query(updateQuery);
                    console.log(`${this.className} - OBJECT IDs UPDATED SUCCESSFULLY.`)
                }
            } catch (e) {
                console.error(e);
                return e;
            }
        } catch (error) {
            console.log('unexpected error: ', error);
            return error;
        }

        return newEntries;
    }

    async fetchAscendToken() {
        try {
            var data = qs.stringify({
                'grant_type': 'client_credentials',
                'client_id': 'L1NPNF1mtTHoAPQj6BFixkXvxFaLGL4q',
                'client_secret': 'xRrMXCnrU4JRUR4K'
            });
            var config = {
                method: 'post',
                url: 'https://prod.hs1api.com/oauth/client_credential/accesstoken?grant_type=client_credentials',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: data
            };
            const response: any = await axios(config)
            return response.data;
        } catch (error) {
            console.log(error);
        }
    }

    abstract syncWithAscend(): any;

    abstract connectComplexTypes(): any;

    async executeConnectComplexTypes(complexTypes: any[], className: string) {
        console.log(`Executing Connect Complex Schema Types : ${className}`);

        let relationPostgresQuery = `select "objectId"`;
        let shouldRunRelationPostgresQuery = false;
        let relationPostgresQueryColumns: any[] = [];

        let pointerPostgresQuery = `update public."${this.className}" set `;
        let shouldRunPointerPostgresQuery = false;

        for (let x = 0; x < complexTypes.length; x++) {
            const t = complexTypes[x];
            if (!t.shouldIgnore) {
                if (t.isRelation) {
                    // deal with relations here
                    if (!t.shouldIgnore) {
                        relationPostgresQueryColumns.push(t.columnName);
                        shouldRunRelationPostgresQuery = true;
                        relationPostgresQuery += `, "${t.columnName}_ascend"`
                    }
                } else {
                    // deal with pointers here
                    if (!t.shouldIgnore) {
                        shouldRunPointerPostgresQuery = true;
                        pointerPostgresQuery += `"${t.columnName}"="${t.columnName}_ascend"->>'id',`;
                    }
                }
            }
        }

        pointerPostgresQuery = pointerPostgresQuery.substring(0, pointerPostgresQuery.length - 1) + ` where "migrationStatus" is distinct from 'COMPLETE';`

        console.log(`${this.className} -> shouldRunRelationPostgresQuery: ${shouldRunRelationPostgresQuery}`)
        console.log(`${this.className} -> shouldRunPointerPostgresQuery: ${shouldRunPointerPostgresQuery} > relationPostgresQueryColumns: ${relationPostgresQueryColumns}`)

        if (shouldRunPointerPostgresQuery) {
            try {
                console.log(`\n\nCONNECTION 1:1 Parse.Pointers for ${this.className} \n${pointerPostgresQuery}\n\n`);
                await pgClient.query(pointerPostgresQuery);
                console.log(`\n\n${this.className} - MIGRATION FOR Parse.Pointers COMPLETED!\n\n`)
            } catch (error) {
                console.log(`\n\nERROR WHILE RUNNING PG QUERY:\n${pointerPostgresQuery}\n\n${error}\n\n`);
            }
        } else {
            console.log(`\n\nNO 1:1 Parse.Pointers for -> ${this.className}\n\n`);
        }

        if (shouldRunRelationPostgresQuery) {
            try {
                relationPostgresQuery += `  from public."${this.className}" where "migrationStatus" is distinct from 'COMPLETE'`
                console.log(`\n\nCONNECTION 1:n Parse.Relation for ${this.className} \n${relationPostgresQuery} fetching all matching rows ...\n\n`);

                const allRelationalEntries = await pgClient.query(relationPostgresQuery);

                console.log(relationPostgresQueryColumns)
                console.log(`allRelationalEntries.rows.length : ${allRelationalEntries.rows.length}`);

                for (let x = 0; x < allRelationalEntries.rows.length; x++) {
                    const row = allRelationalEntries.rows[x];
                    for (let y = 0; y < relationPostgresQueryColumns.length; y++) {
                        const columnKey = relationPostgresQueryColumns[y];
                        for (let z = 0; z < row[columnKey + '_ascend'].length; z++) {
                            try {
                                const related = row[columnKey + '_ascend'][z];
                                console.log(row.objectId, related.id);
                                await pgClient.query(`INSERT INTO public."_Join:${columnKey}:${this.className}" ("relatedId", "owningId") VALUES  ('${related.id}', '${row.objectId}') ON CONFLICT DO NOTHING`);
                            } catch (error: any) {
                                console.log(error.message);
                            }
                        }
                    }
                }

                console.log(`\n\n${this.className} - MIGRATION FOR Parse.Relation COMPLETED!\n\n`)
            } catch (error) {
                console.log(`\n\nERROR WHILE RUNNING PG QUERY:\n${relationPostgresQuery}\n\n${error}\n\n`);
            }
        } else {
            console.log(`\n\nNO 1:n Parse.Relation for -> ${this.className}\n\n`);
        }

        const updateQuery = `Update public."${this.className}" SET "migrationStatus"='COMPLETE' WHERE "migrationStatus" is distinct from 'COMPLETE';`
        await pgClient.query(updateQuery);

        console.log(`DONE Executing Connect Complex Types For ${this.className}`)
    }

    async parseToAscend(parseObject: any) {
        let objectJSON = parseObject.toJSON();
        console.log(`\n\n`)
        console.log(objectJSON)
        console.log(`\n\n`)

        for(var x=0; x<this.simpleTypes.length; x++) {
            const simpleType = this.simpleTypes[x];
            if (objectJSON[simpleType.columnName]?.['__type'] === 'Date') {
                objectJSON[simpleType.columnName] = objectJSON[simpleType.columnName]?.iso
            }
        }

        for(var x=0; x<this.complexTypes.length; x++) {
            const complexType = this.complexTypes[x];
            if (!complexType.isRelation) {
                if (!!objectJSON[complexType.columnName]) {
                    objectJSON[complexType.columnName] = {
                        id : objectJSON[complexType.columnName].objectId
                    }
                }
            } else {
                var relation = parseObject.relation(complexType.columnName);
                var query = relation.query();
                var relatedObjects = await query.findAll(MASTER_KEY_OPTION);

                objectJSON[complexType.columnName] = []
                for(var y=0; y<relatedObjects.length; y++) {
                    objectJSON[complexType.columnName].push({ id: relatedObjects[y]?.id});
                }
            }
        }
        
        console.log(`\n\n`)
        console.log(objectJSON)
        console.log(`\n\n`)

        return objectJSON;
    }

    abstract updateInAscend(object: Parse.Object, ascendClient: any): any;

    async update(object: any, ascendClient: any) {
        try {
            if ((object.get('lastUpdatedBy').toLowerCase() !== 'ascend')) {
                console.log(`UPDATING ${this.className} - ${object.id} IN ASCEND/DENTRIX`);
                let objectJSON = await this.parseToAscend(object);

                try {
                    const response = await ascendClient.update(this.ascendEndpoint, object.id, objectJSON);
                    const data = response.data;
                    
                    console.log(`\n\n`);
                    console.log(data);
                    console.log(`\n\n`);

                    return data;
                } catch (error: any) {
                    throw new Error(error);
                }
            }
        } catch (error: any) {
            throw new Error(error);
        }
    }

    abstract createInAscend(object: Parse.Object, ascendClient: any): any;

    async create(object: any, ascendClient: any) {
        try {
            if (!(object.get('generatedBy') === 'ASCEND' || object.get('generatedBy') === 'ascend')) {

                console.log(`\n\n${this.className} - NEED TO CREATE IN ASCEND\n\n`);
                let objectJSON = await this.parseToAscend(object);

                try {
                    const response = await ascendClient.create(this.ascendEndpoint, objectJSON);
                    const data = response.data;

                    const jc = NATS.JSONCodec();
                    console.log(`\n\n  nc.publish("create.sync" \n\n`);
                    nc.publish("create.sync", jc.encode({
                        ascendObject: data,
                        ascendObjectId: data.id,
                        localObjectId: object.id,
                        className: this.className
                    }));
                    return data;
                } catch (error: any) {
                    throw new Error(error);
                }
            }
        } catch (error: any) {
            throw new Error(error);
        }
    }

    async publishNatsMessageJson(subject: string, data: any) {
        
    }

    sendUpdateColumnRequest(className: string, objectId: string, column: string, value: string) {
        try {
            const jc = NATS.JSONCodec();
            console.log(`\n\n  nc.publish("update.column" \n\n`);
            nc.publish("update.column", jc.encode({
                className: className,
                objectId: objectId,
                column: column,
                value: value
            }));
        } catch (error) {
            console.log(error);
        }
    }
}

connectNats();

