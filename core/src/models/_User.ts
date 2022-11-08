import * as Parse from 'parse/node';
import axios from 'axios';
import * as qs from 'qs';
import { Client } from 'pg';
import { pgClient } from '../common/PgConnection';
const client = new Client();
import { ModelBase } from './ModelBase';

export interface I_User {
    ascend_id: string
    firstName: string
    middleInitial: string
    lastName: string
    phone1: string
    phone2: string
    username: string
    enabled: boolean
    timeout: number
    isProvider: boolean
    roles: any[]
    currentLocation: Parse.Pointer

    status: string
    lastModified: string
    // INTERNAL FIELDS
    migrationStatus: string

    profile_picture: Parse.File
}

const complexTypes = [
    { columnName: 'currentLocation', className: 'LocationV1', shouldIgnore: false, isRelation: false }
];

export class _User extends ModelBase<I_User> {

    constructor(attributes: I_User) {
        super('_User', attributes);
        this.baseUrl = 'https://prod.hs1api.com/ascend-gateway/api/v0/';
        this.useLastId = true;
        this.className = '_User';
        this.ascendEndpoint = 'users';
    }

    public async updateInAscend(object: Parse.Object, ascendClient: any) {
        throw new Error('Method not implemented.');
    }

    createInAscend(object: Parse.Object<Parse.Attributes>) {
        throw new Error('Method not implemented.');
    }
    
    async connectComplexTypes() {
        await this.executeConnectComplexTypes(complexTypes, this.className);
    }

    async syncWithAscend() {
        console.log(`getAllFromAscend ${this.ascendEndpoint}`)
        
        let newEntries = [];

        try {
            await pgClient.connect();
        } catch (pgClientError) {
            console.log(pgClientError);
        }

        try {
            let page = 1;
            await this.updateLastId();
            console.log(`${this.className} lastId : ${this.lastId}`);
            while (true) {
                const tokenObject = await this.fetchAscendToken();
                const response: any = await axios({
                    method: 'get',
                    url: `${this.baseUrl}${this.ascendEndpoint}?pageSize=500&page=${page}${!!this.useLastId ? '&lastId='+this.lastId : ''}`,
                    headers: {
                        'Organization-ID': '5fd1407ae6c7d408cb4fdb60',
                        'Authorization': `Bearer ${tokenObject.access_token}`
                    },
                    data: qs.stringify({})
                });

                const objects = response.data.data;

                console.log(`page# ${page} - found ${objects.length} new items - total migrated ${newEntries.length} - ${this.ascendEndpoint}`);

                for (var x = 0; x < objects.length; x++) {

                    const obj = objects[x];
                    
                    newEntries.push(obj);

                    var user = new Parse.User();

                    obj['ascend_id'] = obj['id'];
                    obj['ascend_email'] = obj['email'];

                    obj['generatedBy'] = 'ascend'
                    obj['lastUpdatedBy'] = 'ascend'

                    complexTypes.forEach((t) => {
                        obj[`${t.columnName}_ascend`] = obj[t.columnName];
                        delete obj[t.columnName];
                    })

                    obj.peopleSets = [];
                    obj.emailVerified = true;
                    obj.name = `${obj['firstName']} ${obj['lastName']}`

                    try {                        
                        user.set('username', obj.username);
                        user.set('password', 'Abcd1234.$');

                        delete obj['type'];
                        delete obj['id'];
                        delete obj['email'];
                        delete obj['username'];

                        await user.signUp(obj, {useMasterKey: true});
                    } catch (error) {
                        console.log(`${user.get('username')} - ${user.get('email')} - ${error}`)
                    }
                }

                if (objects.length) {
                    page++;
                } else {
                    break;
                }
            }

            // update all parse object ids to match dentix asecend 
            try {
                console.log(`UPDATING PARSE OBJECT IDs for ${this.className}`)
                await pgClient.query(`UPDATE public."_User" SET "objectId" = ascend_id`);
            } catch (e) {
                console.error(e);
            }

        } catch (error) {
            console.log('unexpected error: ', error);
            return error;
        }

        return newEntries;
    }
}

Parse.Object.registerSubclass('_User', _User);

const schema = new Parse.Schema('_User');
schema.addString('ascend_id')
schema.addString('firstName')
schema.addString('middleInitial')
schema.addString('lastName')
schema.addString('phone1')
schema.addString('phone2')
schema.addString('username')
schema.addBoolean('enabled')
schema.addNumber('timeout')
schema.addBoolean('isProvider')
schema.addArray('roles')
schema.addPointer('currentLocation', 'LocationV1')
schema.addString('lastModified')
schema.addDate('startDate')
schema.addString('name')
schema.addString('status')
schema.addString('migrationStatus')
schema.addString('profile_picture')
schema.addString('generatedBy', { required: true })
schema.addString('lastUpdatedBy', { required: true })
schema.addObject('currentLocation_ascend')

export { schema as _UserSchema }