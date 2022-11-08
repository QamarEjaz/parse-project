import * as Parse from 'parse/node';
import { ModelBase } from './ModelBase';

export interface ITxCaseV1 {
    ascend_id: string
    name: string
    status: string
    note: string
    expirationDate: string
    showExpirationDate: boolean	
    showNote: boolean
    // TO BE FIGURED OUT
    providerSignature: any
    // TO BE FIGURED OUT
    witnessSignature: any
    providerSignatureDate: string
    witnessSignatureDate: string
    user: Parse.Pointer
    patient: Parse.Pointer
    procedures: Parse.Relation
    lastModified: string
    // INTERNAL FIELDS
    migrationStatus: string
}

const className = 'TxCaseV1'
const ascendEndpoint = '/v1/txcases'
const complexTypes = [
    { columnName: 'user', className: '_User', shouldIgnore: false },
    { columnName: 'patient', className: 'PatientV1', shouldIgnore: false },
    { columnName: 'procedures', className: 'PatientProcedureV1', shouldIgnore: false, isRelation: true },
    { columnName: 'providerSignature', className: 'Signature', shouldIgnore: false },
    { columnName: 'witnessSignature', className: 'Signature', shouldIgnore: false }
]

export class TxCaseV1 extends ModelBase<ITxCaseV1> {
    
    constructor(attributes: ITxCaseV1) {
        super(className, attributes);
        this.ascendEndpoint = ascendEndpoint;
        this.className = className;
    }
    
    async connectComplexTypes() {
        await this.executeConnectComplexTypes(complexTypes, className);
    }
    
    async syncWithAscend() {
        const newEntries = await this.getAllFromAscend(ascendEndpoint, complexTypes, TxCaseV1);
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

Parse.Object.registerSubclass(className, TxCaseV1);

const schema = new Parse.Schema(className);
schema.addString('ascend_id')
schema.addString('name')
schema.addString('status')
schema.addString('note')
schema.addString('expirationDate')
schema.addBoolean('showExpirationDate')
schema.addBoolean('showNote')
schema.addString('providerSignatureDate')
schema.addString('witnessSignatureDate')
schema.addString('lastModified')
schema.addPointer('user', '_User')
schema.addPointer('patient', 'PatientV1')
schema.addRelation('procedures', 'PatientProcedureV1')
schema.addPointer('providerSignature', 'Signature')
schema.addPointer('witnessSignature', 'Signature')
schema.addString('migrationStatus')
schema.addString('generatedBy', { required: true })
schema.addString('lastUpdatedBy', { required: true })
schema.addObject('user_ascend')
schema.addObject('patient_ascend')
schema.addArray('procedures_ascend')
schema.addObject('providerSignature_ascend')
schema.addObject('witnessSignature_ascend')

export { schema as TxCaseV1Schema }


