import * as Parse from 'parse/node';
import { ModelBase } from './ModelBase';

export interface IPracticeProcedureV1 {
    ascend_id: string
    aliasCode: string
    description: string
    abbreviatedDescription: string
    favorite: boolean
    active: boolean
    category: string
    treatmentArea: string
    chartingSymbol: string
    billToInsurance: boolean
    fee: number	
    needsPredetermination: boolean	
    isClinicalNoteRequired: boolean
    procedures: []
    ponticProcedure: Parse.Pointer
    retainerProcedure: Parse.Pointer
    adaCode: string
    isTreatmentInfoRequired: boolean
    codeExtension: string
    codeVersion: number
    defaultTeethRange: string
    codeType: string
    recareTemplate: Parse.Pointer
    lastModified: string
    // INTERNAL FIELDS
    migrationStatus: string
}

const className = 'PracticeProcedureV1'
const ascendEndpoint = '/v1/practiceprocedures'
const complexTypes = [
    { columnName: 'ponticProcedure', className: 'PracticeProcedureV1', shouldIgnore: false },
    { columnName: 'retainerProcedure', className: 'PracticeProcedureV1', shouldIgnore: false },
    { columnName: 'recareTemplate', className: 'RecareTemplateV1', shouldIgnore: false }
]

export class PracticeProcedureV1 extends ModelBase<IPracticeProcedureV1> {
    
    constructor(attributes: IPracticeProcedureV1) {
        super(className, attributes);
        this.ascendEndpoint = ascendEndpoint;
        this.className = className;
    }
    
    async connectComplexTypes() {
        await this.executeConnectComplexTypes(complexTypes, className);
    }
    
    async syncWithAscend() {
        const newEntries = await this.getAllFromAscend(ascendEndpoint, complexTypes, PracticeProcedureV1);
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

Parse.Object.registerSubclass(className, PracticeProcedureV1);

const schema = new Parse.Schema(className);
schema.addString('ascend_id')
schema.addString('aliasCode')
schema.addString('description')
schema.addString('abbreviatedDescription')
schema.addBoolean('favorite')
schema.addBoolean('active')
schema.addString('category')	
schema.addString('treatmentArea')	
schema.addString('chartingSymbol')	
schema.addBoolean('billToInsurance')	
schema.addNumber('fee')	
schema.addBoolean('needsPredetermination')	
schema.addBoolean('isClinicalNoteRequired')
schema.addArray('procedures')
schema.addString('adacode')
schema.addString('codeExtension')
schema.addString('defaultTeethRange')
schema.addString('codeType')
schema.addString('lastModified')
schema.addPointer('ponticProcedure', 'PracticeProcedureV1')
schema.addPointer('retainerProcedure', 'PracticeProcedureV1')
schema.addPointer('recareTemplate', 'RecareTemplateV1')
schema.addString('migrationStatus')
schema.addString('generatedBy', { required: true })
schema.addString('lastUpdatedBy', { required: true })
schema.addObject('ponticProcedure_ascend')
schema.addObject('retainerProcedure_ascend')
schema.addObject('recareTemplate_ascend')

export { schema as PracticeProcedureV1Schema }


