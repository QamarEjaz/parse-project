import * as Parse from 'parse/node';
import { ModelBase } from './ModelBase';

export interface IRecareTemplateV1 {
    ascend_id: string
    recareType: string
    description: string
    isPrimary: boolean
    intervalUnit: string
    interval: number	
    practiceProcedures: Parse.Relation
    isDefault: boolean
    lastModified: string
    // INTERNAL FIELDS
    migrationStatus: string
}

const className = 'RecareTemplateV1'
const ascendEndpoint = '/v1/recaretemplates'
const complexTypes = [
    { columnName: 'practiceProcedures', className: 'PracticeProcedureV1', shouldIgnore: false, isRelation: true }
]

export class RecareTemplateV1 extends ModelBase<IRecareTemplateV1> {
    
    constructor(attributes: IRecareTemplateV1) {
        super(className, attributes);
        this.ascendEndpoint = ascendEndpoint;
        this.className = className;
    }
    
    async connectComplexTypes() {
        await this.executeConnectComplexTypes(complexTypes, className);
    }
    
    async syncWithAscend() {
        const newEntries = await this.getAllFromAscend(ascendEndpoint, complexTypes, RecareTemplateV1);
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

Parse.Object.registerSubclass(className, RecareTemplateV1);

const schema = new Parse.Schema(className);
schema.addString('ascend_id')
schema.addString('recareType')
schema.addString('description')
schema.addBoolean('isPrimary')
schema.addString('intervalUnit')
schema.addNumber('interval')
schema.addBoolean('isDefault')
schema.addString('lastModified')
schema.addRelation('practiceProcedures', 'PracticeProcedureV1')
schema.addString('migrationStatus')
schema.addString('generatedBy', { required: true })
schema.addString('lastUpdatedBy', { required: true })
schema.addArray('practiceProcedures_ascend')

export { schema as RecareTemplateV1Schema }


