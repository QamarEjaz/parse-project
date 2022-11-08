import * as Parse from 'parse/node';
import { ModelBase } from './ModelBase';

export interface IPatientProcedureV1 {
    ascend_id: string
    amount: number
    entryDate: string
    serviceDate: string
    startDate: string
    endDate: string
    treatmentPlannedDate: string
    expirationDate: string
    status: string
    oralCavity: string
    notes: string
    state: string
    primaryInsuranceEstimateOverride: number
    secondaryInsuranceEstimateOverride: number
    billToInsurance: boolean
    autoCalculateEstimateEnabled: boolean
    monthsRemaining: number
    procedureTeeth: []
    practiceProcedure: Parse.Pointer
    renderingProvider: Parse.Pointer
    treatmentPlannedProvider: Parse.Pointer
    insuranceClaims: Parse.Relation
    patientConditions: Parse.Relation
    perioExams: Parse.Relation
    primaryInsurance: number
    secondaryInsurance: number
    writeOff: number
    guarantorPortion: number
    unlock: boolean
    lastModified: string
    patient: Parse.Pointer
    location: Parse.Pointer
    // TO BE FIGURED OUT (TEMPSOLVE)
    // replacedBy: Parse.Pointer
    replacedBy: any
    // INTERNAL FIELDS
    migrationStatus: string
}

const className = 'PatientProcedureV1'
const ascendEndpoint = '/v1/patientprocedures'
const complexTypes = [
    // TO BE FIGURED OUT (TEMPSOLVE) once figured set shouldIgnore to false
    { columnName: 'replacedBy', className: 'ProviderV1', shouldIgnore: false },
    { columnName: 'location', className: 'LocationV1', shouldIgnore: false },
    { columnName: 'patient', className: 'PatientV1', shouldIgnore: false },
    { columnName: 'insuranceClaims', className: 'InsuranceClaim', shouldIgnore: false, isRelation: true },
    { columnName: 'patientConditions', className: 'PatientConditionV1', shouldIgnore: false, isRelation: true },
    { columnName: 'perioExams', className: 'PerioExam', shouldIgnore: false, isRelation: true },
    { columnName: 'practiceProcedure', className: 'PracticeProcedureV1', shouldIgnore: false },
    { columnName: 'renderingProvider', className: 'ProviderV1', shouldIgnore: false },
    { columnName: 'treatmentPlannedProvider', className: 'ProviderV1', shouldIgnore: false }
]

export class PatientProcedureV1 extends ModelBase<IPatientProcedureV1> {
    
    constructor(attributes: IPatientProcedureV1) {
        super(className, attributes);
        this.ascendEndpoint = ascendEndpoint;
        this.className = className;
    }
    
    async connectComplexTypes() {
        await this.executeConnectComplexTypes(complexTypes, className);
    }

    async syncWithAscend() {
        const newEntries = await this.getAllFromAscend(ascendEndpoint, complexTypes, PatientProcedureV1);
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

Parse.Object.registerSubclass(className, PatientProcedureV1);

const schema = new Parse.Schema(className);
schema.addString('ascend_id')

schema.addBoolean('unlock')
schema.addNumber('amount')
schema.addString('lastModified')
schema.addString('entryDate')
schema.addString('serviceDate')
schema.addString('startDate')
schema.addString('endDate')
schema.addString('treatmentPlannedDate')
schema.addString('expirationDate')
schema.addString('status')
schema.addString('oralCavity')
schema.addString('notes')
schema.addString('state')
schema.addNumber('primaryInsuranceEstimateOverride')
schema.addNumber('secondaryInsuranceEstimateOverride')
schema.addBoolean('billToInsurance')
schema.addBoolean('autoCalculateEstimateEnabled')
schema.addNumber('monthsRemaining')
schema.addArray('procedureTeeth')
schema.addNumber('primaryInsurance')
schema.addNumber('secondaryInsurance')
schema.addNumber('writeOff')
schema.addNumber('guarantorPortion')

schema.addPointer('location', 'LocationV1')
schema.addPointer('patient', 'PatientV1')
schema.addRelation('insuranceClaims', 'InsuranceClaim')
schema.addRelation('patientConditions', 'PatientConditionV1')
schema.addRelation('perioExams', 'PerioExam')
// TO BE FIGURED OUT (TEMPSOLVE)
// schema.addPointer('replacedBy', '????')
schema.addObject('replacedBy')
schema.addPointer('practiceProcedure', 'PracticeProcedureV1')
schema.addPointer('renderingProvider', 'ProviderV1')
schema.addPointer('treatmentPlannedProvider', 'ProviderV1')
schema.addString('migrationStatus')
schema.addString('generatedBy', { required: true })
schema.addString('lastUpdatedBy', { required: true })
schema.addObject('replacedBy_ascend')
schema.addObject('location_ascend')
schema.addObject('patient_ascend')
schema.addArray('insuranceClaims_ascend')
schema.addArray('patientConditions_ascend')
schema.addArray('perioExams_ascend')
schema.addObject('practiceProcedure_ascend')
schema.addObject('renderingProvider_ascend')
schema.addObject('treatmentPlannedProvider_ascend')

export { schema as PatientProcedureV1Schema }


