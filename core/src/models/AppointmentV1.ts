import { PatientV1 } from './PatientV1';
import { ProviderV1 } from './ProviderV1';
import { ModelBase } from './ModelBase';
import { OperatoryV1 } from './OperatoryV1';
import { LocationV1 } from './LocationV1';

export interface IAppointmentV1 {
    ascend_id: string
    start: string
    end: string
    created: string
    confirmed: string
    needsFollowUp: boolean
    followedUpOn: string
    needsPremedicate: boolean
    status: string
    note: string
    other: string
    bookedOnline: boolean
    leftMessage: string
    bookingType: string
    duration: number
    lastModified: string
    labCaseDentalLab: Parse.Pointer
    labCaseStatus: string
    labCaseDueDate: string
    labCaseNote: string
    patientProcedures: Parse.Relation
    practiceProcedures: Parse.Relation
    visits: Parse.Relation
    provider: Parse.Pointer | ProviderV1
    otherProvider: Parse.Pointer
    location: Parse.Pointer | LocationV1
    patient: Parse.Pointer | PatientV1
    operatory: Parse.Pointer | OperatoryV1
    // INTERNAL FIELDS
    teamMembers: Parse.Pointer[]
    migrationStatus: string
    chiefConcern: string
    cancelReason: string
    generatedBy: string
    lastUpdatedBy: string
}

const ascendEndpoint = '/v1/appointments'

const SIMPLE_TYPES = [
    { columnName: 'start', shouldIgnore: false, type: 'Date' },
    { columnName: 'end', shouldIgnore: false, type: 'Date' },
    { columnName: 'created', shouldIgnore: false, type: 'Date' },
    { columnName: 'confirmed', shouldIgnore: false, type: 'Date' },
    { columnName: 'lastModified', shouldIgnore: false, type: 'Date' }
]

const COMPLEX_TYPES = [
    { columnName: 'labCaseDentalLab', className: 'DentalLabV1', shouldIgnore: false },
    { columnName: 'patientProcedures', className: 'PatientProcedureV1', shouldIgnore: false, isRelation: true },
    { columnName: 'practiceProcedures', className: 'PracticeProcedureV1', shouldIgnore: false, isRelation: true },
    { columnName: 'visits', className: 'VisitV1', shouldIgnore: false, isRelation: true },
    { columnName: 'provider', className: 'ProviderV1', shouldIgnore: false },
    { columnName: 'otherProvider', className: 'ProviderV1', shouldIgnore: false },
    { columnName: 'location', className: 'LocationV1', shouldIgnore: false },
    { columnName: 'patient', className: 'PatientV1', shouldIgnore: false },
    { columnName: 'operatory', className: 'OperatoryV1', shouldIgnore: false },
]

export class AppointmentV1 extends ModelBase<IAppointmentV1> {
    static className = 'AppointmentV1';

    constructor(attributes: IAppointmentV1) {
        super(AppointmentV1.className, attributes);
        this.complexTypes = COMPLEX_TYPES;
        this.simpleTypes = SIMPLE_TYPES;
        this.ascendEndpoint = ascendEndpoint;
        this.className = AppointmentV1.className;
    }

    public async connectComplexTypes() {
        await this.executeConnectComplexTypes(this.complexTypes, AppointmentV1.className);
    }

    public async syncWithAscend() {
        const newEntries = await this.getAllFromAscend(ascendEndpoint, this.complexTypes, AppointmentV1, this.simpleTypes);
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

    public async createInAscend(object: Parse.Object, ascendClient: any) {
        try {
            const appt = await this.create(object, ascendClient);
            return appt;
        } catch (error) {
            console.log(error);
        }
    }

    public async deleteInAscend(object: Parse.Object, ascendClient: any) {
        try {
            const response = await ascendClient.delete(this.ascendEndpoint, object.id);
            console.log(response);
        } catch (error) {
            console.log(`\n\nERROR WHILE DELETING OBJECT IN ASCEND ...`);
            console.log(object);
        }
    }
}

Parse.Object.registerSubclass(
    AppointmentV1.className,
    AppointmentV1
);

export const AppointmentV1Schema = new Parse.Schema(AppointmentV1.className)
    .addString('ascend_id')
    .addDate('start', { required: false })
    .addDate('end')
    .addDate('created')
    .addDate('confirmed')
    .addDate('lastModified')
    .addBoolean('needsFollowUp')
    .addString('followedUpOn')
    .addBoolean('needsPremedicate')
    .addString('status', { required: false })
    .addString('note')
    .addString('other', { required: false })
    .addBoolean('bookedOnline')
    .addString('leftMessage')
    .addString('bookingType')
    .addNumber('duration')
    .addString('labCaseStatus')
    .addString('labCaseDueDate')
    .addString('labCaseNote')
    .addPointer('labCaseDentalLab', 'DentalLabV1')
    .addPointer('provider', 'ProviderV1', { required: false })
    .addPointer('otherProvider', 'ProviderV1')
    .addPointer('location', 'LocationV1')
    .addPointer('patient', 'PatientV1')
    .addPointer('operatory', 'OperatoryV1', { required: false })
    .addArray('teamMembers')
    .addRelation('patientProcedures', 'PatientProcedureV1')
    .addRelation('practiceProcedures', 'PracticeProcedureV1')
    .addRelation('visits', 'VisitV1')
    .addString('migrationStatus')
    .addString('chiefConcern')
    .addObject('labCaseDentalLab_ascend')
    .addArray('patientProcedures_ascend')
    .addArray('practiceProcedures_ascend')
    .addArray('visits_ascend')
    .addObject('provider_ascend')
    .addObject('otherProvider_ascend')
    .addObject('location_ascend')
    .addObject('patient_ascend')
    .addObject('operatory_ascend')
    .addString('start_ascend')
    .addString('end_ascend')
    .addString('created_ascend')
    .addString('confirmed_ascend')
    .addString('lastModified_ascend')
    .addString('generatedBy', { required: true })
    .addString('lastUpdatedBy', { required: true })
    .addBoolean('ascendSyncCompleted')
    .addString('cancelReason');