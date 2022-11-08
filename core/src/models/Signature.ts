import * as Parse from 'parse/node';
import { ModelBase } from './ModelBase';

export interface ISignature {
    ascend_id: string
    data: string
    lastModified: string
    user: Parse.Pointer
    migrationStatus: string
}

const className = 'Signature'
const ascendEndpoint = '/v0/signatures'
const complexTypes: any[] = [
    { columnName: 'user', className: '_User', shouldIgnore: false },
]

export class Signature extends ModelBase<ISignature> {
    constructor(attributes: ISignature) {
        super(className, attributes);
        this.ascendEndpoint = ascendEndpoint;
        this.className = className;
    }

    async connectComplexTypes() {
        await this.executeConnectComplexTypes(complexTypes, className);
    }

    async syncWithAscend() {
        const newEntries = await this.getAllFromAscend(ascendEndpoint, complexTypes, Signature);
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

Parse.Object.registerSubclass(className, Signature);

const schema = new Parse.Schema(className);
schema.addString('ascend_id')
schema.addString('data')
schema.addString('lastModified')
schema.addPointer('user', '_User')
schema.addString('migrationStatus')
schema.addString('generatedBy', { required: true })
schema.addString('lastUpdatedBy', { required: true })
schema.addObject('user_ascend')

export { schema as SignatureSchema }