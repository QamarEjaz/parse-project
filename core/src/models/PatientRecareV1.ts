import * as Parse from 'parse/node';
import { ModelBase } from './ModelBase';

export interface IPatientRecareV1 {
    ascend_id: string
    
    dueDate: string
    intervalUnit: string
    interval: number
    serviceDate: string
    postedDate: string
    status: string
    lastModified: string
    
    scheduledAppointment: Parse.Pointer
    patient: Parse.Pointer
    location: Parse.Pointer
    recareTemplate: Parse.Pointer
    user: Parse.Pointer

    practiceProcedures: Parse.Relation
    
    migrationStatus: string
}

const className = 'PatientRecareV1'
const ascendEndpoint = '/v1/patientrecares'
const complexTypes: any[] = [
    { columnName: 'scheduledAppointment', className: 'AppointmentV1', shouldIgnore: false },
    { columnName: 'patient', className: 'PatientV1', shouldIgnore: false },
    { columnName: 'location', className: 'LocationV1', shouldIgnore: false },
    { columnName: 'user', className: '_User', shouldIgnore: false },
    { columnName: 'recareTemplate', className: 'RecareTemplateV1', shouldIgnore: false },
    { columnName: 'practiceProcedures', className: 'PracticeProcedureV1', shouldIgnore: false, isRelation: true },
]

export class PatientRecareV1 extends ModelBase<IPatientRecareV1> {
    constructor(attributes: IPatientRecareV1) {
        super(className, attributes);
        this.ascendEndpoint = ascendEndpoint;
        this.className = className;
    }

    async connectComplexTypes() {
        await this.executeConnectComplexTypes(complexTypes, className);
    }

    async syncWithAscend() {
        const newEntries = await this.getAllFromAscend(ascendEndpoint, complexTypes, PatientRecareV1);
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

Parse.Object.registerSubclass(className, PatientRecareV1);

const schema = new Parse.Schema(className);

schema.addString('ascend_id')
schema.addString('migrationStatus')
schema.addString('dueDate')
schema.addString('intervalUnit')
schema.addNumber('interval')
schema.addString('serviceDate')
schema.addString('postedDate')
schema.addString('status')
schema.addString('lastModified')
schema.addPointer('scheduledAppointment', 'AppointmentV1')
schema.addPointer('patient', 'PatientV1')
schema.addPointer('location', 'LocationV1')
schema.addPointer('recareTemplate', 'RecareTemplateV1')
schema.addPointer('user', '_User')
schema.addRelation('practiceProcedures', 'PracticeProcedureV1')
schema.addString('generatedBy', { required: true })
schema.addString('lastUpdatedBy', { required: true })
schema.addObject('scheduledAppointment_ascend')
schema.addObject('patient_ascend')
schema.addObject('location_ascend')
schema.addObject('user_ascend')
schema.addObject('recareTemplate_ascend')
schema.addArray('practiceProcedures_ascend')

export { schema as PatientRecareV1Schema }