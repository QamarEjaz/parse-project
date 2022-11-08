import * as Parse from 'parse/node';
import { ModelBase } from './ModelBase';

export interface IFeeScheduleV1 {
    ascend_id: string
    name: string
    lastModified: string
    // INTERNAL FIELDS
    migrationStatus: string
}

const className = 'FeeScheduleV1'
const ascendEndpoint = '/v1/feeschedules'
const complexTypes: any[] = []

export class FeeScheduleV1 extends ModelBase<IFeeScheduleV1> {
    async connectComplexTypes() {
        await this.executeConnectComplexTypes(complexTypes, className);
    }

    async syncWithAscend() {
        const newEntries = await this.getAllFromAscend(ascendEndpoint, [], FeeScheduleV1);
        return newEntries;
    }

    public async updateInAscend(object: Parse.Object, ascendClient: any) {
        try {
            return await this.update(object, ascendClient);
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    async createInAscend(object: Parse.Object, ascendClient: any) {
        try {
            return await this.create(object, ascendClient);
        } catch (error) {
            console.log(error);
        }
    }

    constructor(attributes: IFeeScheduleV1) {
        super(className, attributes);
        this.ascendEndpoint = ascendEndpoint;
        this.className = className;
    }
}

Parse.Object.registerSubclass(className, FeeScheduleV1);

const schema = new Parse.Schema(className);
schema.addString('ascend_id')
schema.addString('name')
schema.addString('lastModified')
schema.addString('migrationStatus')
schema.addString('generatedBy', { required: true })
schema.addString('lastUpdatedBy', { required: true })

export { schema as FeeScheduleV1Schema }