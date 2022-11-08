import * as Parse from 'parse/node';
import { ModelBase } from './ModelBase';

export interface IVisitV1 {
    ascend_id: string
    duration: number
    sequence: number
    procedures: Parse.Relation
    lastModified: string
    txCase: Parse.Pointer
    // INTERNAL FIELDS
    migrationStatus: string
}

const className = 'VisitV1'
const ascendEndpoint = '/v1/visits'
const complexTypes = [
    { columnName: 'procedures', className: 'PatientProcedureV1', shouldIgnore: false, isRelation: true },
    { columnName: 'txCase', className: 'TxCaseV1', shouldIgnore: false },
    { columnName: 'appointment', className: 'AppointmentV1', shouldIgnore: false }
]

export class VisitV1 extends ModelBase<IVisitV1> {
    
    constructor(attributes: IVisitV1) {
        super(className, attributes);
        this.ascendEndpoint = ascendEndpoint;
        this.className = className;
    }
    
    async connectComplexTypes() {
        await this.executeConnectComplexTypes(complexTypes, className);
    }
    
    async syncWithAscend() {
        const newEntries = await this.getAllFromAscend(ascendEndpoint, complexTypes, VisitV1);
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

Parse.Object.registerSubclass(className, VisitV1);

const schema = new Parse.Schema(className);
schema.addString('ascend_id')
schema.addNumber('duration')
schema.addNumber('sequence')
schema.addString('lastModified')
schema.addRelation('procedures', 'PatientProcedureV1')
schema.addPointer('appointment', 'AppointmentV1')
schema.addPointer('txCase', 'TxCaseV1')
schema.addString('migrationStatus')
schema.addString('generatedBy', { required: true })
schema.addString('lastUpdatedBy', { required: true })
schema.addArray('procedures_ascend')
schema.addObject('txCase_ascend')
schema.addObject('appointment_ascend')

export { schema as VisitV1Schema }


