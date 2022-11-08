import * as Parse from 'parse/node';
import { ModelBase } from './ModelBase';

export interface IProviderNumber {
    ascend_id: string
    number: string
    location: Parse.Pointer
    // INTERNAL FIELDS
    migrationStatus: string
}

const className = 'ProviderNumber'
const ascendEndpoint = '/v1/providers'
const complexTypes = [
    { columnName: 'location', className: 'LocationV1', shouldIgnore: false },
    { columnName: 'user', className: '_User', shouldIgnore: false },
]

export class ProviderNumber extends ModelBase<IProviderNumber> {
    constructor(attributes: IProviderNumber) {
        super(className, attributes);
        this.useLastId = true;
        this.ascendEndpoint = ascendEndpoint;
        this.className = className;
    }

    async connectComplexTypes() {
        await this.executeConnectComplexTypes(complexTypes, className);
    }
    
    async syncWithAscend() {
        const newEntries = await this.getAllFromAscend(ascendEndpoint, complexTypes, ProviderNumber);
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
}

Parse.Object.registerSubclass(className, ProviderNumber);

const schema = new Parse.Schema(className);
schema.addString('ascend_id')
schema.addString('number')
schema.addPointer('location', 'LocationV1')
schema.addPointer('user', '_User')
schema.addString('migrationStatus')
schema.addString('generatedBy', { required: true })
schema.addString('lastUpdatedBy', { required: true })
schema.addObject('location_ascend')
schema.addObject('user_ascend')

export { schema as ProviderNumberSchema }