import * as Parse from 'parse/node';
import { ModelBase } from './ModelBase';

export interface IPatientInsurancePlan {
    ascend_id: string
    startDate: string
    endDate: string
    relationshipToSubscriber: string
    eligible: string
    confirmedDate: string
    note: string
    eligibilityCheckType: string
    responsibilities: []
    previous_benefitYear: number
    previous_basicIndividualLifetimeDeductibleMet: number
    previous_basicIndividualAnnualDeductibleMet: number
    previous_preventiveIndividualLifetimeDeductibleMet: number
    previous_preventiveIndividualAnnualDeductibleMet: number
    previous_majorIndividualLifetimeDeductibleMet: number
    previous_majorIndividualAnnualDeductibleMet: number
    previous_orthoIndividualLifetimeDeductibleMet: number
    previous_orthoIndividualAnnualDeductibleMet: number
    previous_maximumIndividualAnnualBenefitUsed: number
    previous_maximumOrthoLifetimeBenefitUsed: number
    current_benefitYear: number
    current_basicIndividualLifetimeDeductibleMet: number
    current_basicIndividualAnnualDeductibleMet: number
    current_preventiveIndividualLifetimeDeductibleMet: number
    current_preventiveIndividualAnnualDeductibleMet: number
    current_majorIndividualLifetimeDeductibleMet: number
    current_majorIndividualAnnualDeductibleMet: number
    current_orthoIndividualLifetimeDeductibleMet: number
    current_orthoIndividualAnnualDeductibleMet: number
    current_maximumIndividualAnnualBenefitUsed: number
    current_maximumOrthoLifetimeBenefitUsed: number
    patient: Parse.Pointer
    subscriberInsurancePlan: Parse.Pointer
    lastModified: string
    // INTERNAL FIELDS
    migrationStatus: string
}

const className = 'PatientInsurancePlan'
const ascendEndpoint = '/v0/patientinsuranceplans'
const complexTypes = [
    { columnName: 'patient', className: 'PatientV1', shouldIgnore: false },
    { columnName: 'subscriberInsurancePlan', className: 'SubscriberInsurancePlan', shouldIgnore: false }
]

export class PatientInsurancePlan extends ModelBase<IPatientInsurancePlan> {
    
    constructor(attributes: IPatientInsurancePlan) {
        super(className, attributes);
        this.ascendEndpoint = ascendEndpoint;
        this.className = className;
    }

    async connectComplexTypes() {
        await this.executeConnectComplexTypes(complexTypes, className);
    }

    async syncWithAscend() {
        const newEntries = await this.getAllFromAscend(ascendEndpoint, complexTypes, PatientInsurancePlan);
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

Parse.Object.registerSubclass(className, PatientInsurancePlan);

const schema = new Parse.Schema(className);
schema.addString('ascend_id')
schema.addString('startDate')
schema.addString('endDate')
schema.addString('relationshipToSubscriber')
schema.addString('eligible')
schema.addString('confirmedDate')
schema.addString('note')
schema.addString('eligibilityCheckType')
schema.addArray('responsibilities')
schema.addNumber('previous_benefitYear')
schema.addNumber('previous_basicIndividualLifetimeDeductibleMet')
schema.addNumber('previous_basicIndividualAnnualDeductibleMet')
schema.addNumber('previous_preventiveIndividualLifetimeDeductibleMet')
schema.addNumber('previous_preventiveIndividualAnnualDeductibleMet')
schema.addNumber('previous_majorIndividualLifetimeDeductibleMet')
schema.addNumber('previous_majorIndividualAnnualDeductibleMet')
schema.addNumber('previous_orthoIndividualLifetimeDeductibleMet')
schema.addNumber('previous_orthoIndividualAnnualDeductibleMet')
schema.addNumber('previous_maximumIndividualAnnualBenefitUsed')
schema.addNumber('previous_maximumOrthoLifetimeBenefitUsed')
schema.addNumber('current_benefitYear')
schema.addNumber('current_basicIndividualLifetimeDeductibleMet')
schema.addNumber('current_basicIndividualAnnualDeductibleMet')
schema.addNumber('current_preventiveIndividualLifetimeDeductibleMet')
schema.addNumber('current_preventiveIndividualAnnualDeductibleMet')
schema.addNumber('current_majorIndividualLifetimeDeductibleMet')
schema.addNumber('current_majorIndividualAnnualDeductibleMet')
schema.addNumber('current_orthoIndividualLifetimeDeductibleMet')
schema.addNumber('current_orthoIndividualAnnualDeductibleMet')
schema.addNumber('current_maximumIndividualAnnualBenefitUsed')
schema.addNumber('current_maximumOrthoLifetimeBenefitUsed')
schema.addString('lastModified')

schema.addPointer('patient', 'PatientV1')
schema.addPointer('subscriberInsurancePlan', 'SubscriberInsurancePlan')
schema.addString('migrationStatus')
schema.addString('generatedBy', { required: true })
schema.addString('lastUpdatedBy', { required: true })
schema.addObject('patient_ascend')
schema.addObject('subscriberInsurancePlan_ascend')

export { schema as PatientInsurancePlanSchema };
