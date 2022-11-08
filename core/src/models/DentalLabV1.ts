import * as Parse from 'parse/node';
import { ModelBase } from './ModelBase';

export interface IDentalLabV1 {
    ascend_id: string
    name: string
    phone: string
    lastModified: string
    migrationStatus: string
}

const className = 'DentalLabV1'
const ascendEndpoint = '/v1/dentallabs'
const complexTypes: any[] = []

export class DentalLabV1 extends ModelBase<IDentalLabV1> {
    constructor(attributes: IDentalLabV1) {
        super(className, attributes);
        this.ascendEndpoint = ascendEndpoint;
        this.className = className;
    }

    async connectComplexTypes() {
        await this.executeConnectComplexTypes(complexTypes, className);
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

    async syncWithAscend() {
        const newEntries = await this.getAllFromAscend(ascendEndpoint, complexTypes, DentalLabV1);
        return newEntries;
    }
}

Parse.Object.registerSubclass(className, DentalLabV1);

const schema = new Parse.Schema(className);
schema.addString('ascend_id')
schema.addString('name')
schema.addString('phone')
schema.addString('lastModified')
schema.addString('migrationStatus')
schema.addString('generatedBy', { required: true })
schema.addString('lastUpdatedBy', { required: true })

export { schema as DentalLabV1Schema }