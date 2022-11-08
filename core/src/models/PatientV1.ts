import { ModelBase } from './ModelBase';
import { SquareCustomer } from './SquareCustomer';

export interface Phone {
    id: string,
    type: string,
    number: string,
    sequence: number,
    phoneType: string
}

export interface IPatientV1 {
    ascend_id: string
    title: string
    firstName: string
    middleInitial: string
    lastName: string
    nameSuffix: string
    preferredName: string
    gender: string
    dateOfBirth: string
    ssn: string
    contactMethod: string
    languageType: string
    patientStatus: string
    emailAddress: string | undefined
    chartNumber: string
    preferredDays: []
    preferredTimes: []
    address1: string
    address2: string
    city: string
    state: string
    postalCode: string
    income: number
    phones: Phone[] | undefined
    primaryProvider: Parse.Pointer
    discountPlan: Parse.Pointer
    duplicateOfPatient: Parse.Pointer
    firstVisitDate: String
    referredByPatient: Parse.Pointer
    referredByReferral: Parse.Pointer
    primaryGuarantor: Parse.Pointer
    secondaryGuarantor: Parse.Pointer
    primaryContact: Parse.Pointer
    secondaryContact: Parse.Pointer
    preferredLocation: Parse.Pointer
    referredPatients: Parse.Relation
    lastModified: string
    socialHistory: string
    levelNeeds: string
    patientTypes: []
    // INTERNAL FIELDS
    squareCustomer: SquareCustomer,
    squareSandboxCustomer: SquareCustomer,
    migrationStatus: string
    lastVisitDate: String
    user: Parse.Pointer
    relatedPatients: Parse.Relation<PatientV1, PatientV1>
    updateInsuranceExpiry?: Date
    updateCreditCardExpiry?: Date
}

const ascendEndpoint = '/v1/patients'
const COMPLEX_TYPES = [
    { columnName: 'primaryProvider', className: 'ProviderV1', shouldIgnore: false },
    { columnName: 'discountPlan', className: 'FeeScheduleV1', shouldIgnore: false },
    { columnName: 'duplicateOfPatient', className: 'PatientV1', shouldIgnore: false },
    { columnName: 'referredByPatient', className: 'PatientV1', shouldIgnore: false },
    { columnName: 'referredByReferral', className: 'ReferralSourceV1', shouldIgnore: false },
    { columnName: 'primaryGuarantor', className: 'PatientV1', shouldIgnore: false },
    { columnName: 'secondaryGuarantor', className: 'PatientV1', shouldIgnore: false },
    { columnName: 'primaryContact', className: 'PatientV1', shouldIgnore: false },
    { columnName: 'secondaryContact', className: 'PatientV1', shouldIgnore: false },
    { columnName: 'preferredLocation', className: 'LocationV1', shouldIgnore: false },
    { columnName: 'referredPatients', className: 'PatientV1', shouldIgnore: false, isRelation: true },
]

const SIMPLE_TYPES: any[] = [];

export class PatientV1 extends ModelBase<IPatientV1> {
    static className = 'PatientV1';

    constructor(attributes: IPatientV1) {
        super(PatientV1.className, attributes);
        this.complexTypes = COMPLEX_TYPES;
        this.simpleTypes = SIMPLE_TYPES;
        this.ascendEndpoint = ascendEndpoint;
        this.className = PatientV1.className;
    }

    async connectComplexTypes() {
        await this.executeConnectComplexTypes(this.complexTypes, PatientV1.className);
    }

    async syncWithAscend() {
        const newEntries = await this.getAllFromAscend(ascendEndpoint, this.complexTypes, PatientV1);
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
            return await this.create(object, ascendClient);
        } catch (error) {
            console.log(error);
            return error;
        }
    }
}

Parse.Object.registerSubclass(
    PatientV1.className,
    PatientV1
);

export const PatientV1Schema = new Parse.Schema(PatientV1.className)
    .addString('ascend_id')
    .addString('title')
    .addString('firstName', { required: false })
    .addString('middleInitial')
    .addString('lastName', { required: false })
    .addString('nameSuffix')
    .addString('preferredName')
    .addString('gender')
    .addString('dateOfBirth', { required: false })
    .addString('ssn', { required: false })
    .addString('contactMethod', { required: false })
    .addString('languageType', { required: false })
    .addString('patientStatus', { required: false })
    .addString('emailAddress')
    .addString('chartNumber')
    .addArray('preferredDays')
    .addArray('preferredTimes')
    .addString('address1', { required: false })
    .addString('address2', { required: false })
    .addString('city', { required: false })
    .addString('state', { required: false })
    .addString('postalCode', { required: false })
    .addNumber('income')
    .addArray('phones')
    .addString('firstVisitDate', { required: false })
    .addString('lastModified', { required: false })
    .addString('socialHistory', { required: false })
    .addString('levelNeeds', { required: false })
    .addPointer('primaryProvider', 'ProviderV1')
    .addPointer('discountPlan', 'FeeScheduleV1')
    .addPointer('duplicateOfPatient', 'PatientV1')
    .addPointer('referredByPatient', 'PatientV1')
    .addPointer('referredByReferral', 'ReferralSourceV1')
    .addPointer('primaryGuarantor', 'PatientV1')
    .addPointer('secondaryGuarantor', 'PatientV1')
    .addPointer('primaryContact', 'PatientV1')
    .addPointer('secondaryContact', 'PatientV1')
    .addPointer('preferredLocation', 'LocationV1')
    .addArray('patientTypes')
    .addRelation('referredPatients', 'PatientV1')
    .addString('migrationStatus')
    .addObject('primaryProvider_ascend')
    .addObject('discountPlan_ascend')
    .addObject('duplicateOfPatient_ascend')
    .addObject('referredByPatient_ascend')
    .addObject('referredByReferral_ascend')
    .addObject('primaryGuarantor_ascend')
    .addObject('secondaryGuarantor_ascend')
    .addObject('primaryContact_ascend')
    .addObject('secondaryContact_ascend')
    .addObject('preferredLocation_ascend')
    .addArray('referredPatients_ascend')
    .addBoolean('hasCompletedAppointment')
    .addRelation('appointments', 'AppointmentV1')
    .addRelation('relatedPatients', 'PatientV1')
    .addDate('lastCompletedAppointmentDate')
    .addFile('profileImage')
    .addString('generatedBy', { required: true })
    .addString('lastUpdatedBy', { required: true })
    .addString('lastVisitDate')
    .addPointer('squareCustomer', SquareCustomer.className)
    .addPointer('squareSandboxCustomer', SquareCustomer.className)
    .addBoolean('ascendSyncCompleted')
    .addPointer('user', "_User")
    .addBoolean('isVip')
    .addDate('updateInsuranceExpiry')
    .addDate('updateCreditCardExpiry');

