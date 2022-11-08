import * as Parse from 'parse/node';
import { ModelBase } from './ModelBase';

export interface ISubscriberInsurancePlan {
    ascend_id: string
    releaseOfInformation: boolean
    assignmentOfBenefits: boolean
    planSubscriberId: string
    previous_benefitYear: number
    previous_basicFamilyAnnualDeductibleMet: number
    previous_preventiveFamilyAnnualDeductibleMet: number
    previous_majorFamilyAnnualDeductibleMet: number
    previous_maximumFamilyAnnualBenefitUsed: number
    current_benefitYear: number
    current_basicFamilyAnnualDeductibleMet: number
    current_preventiveFamilyAnnualDeductibleMet: number
    current_majorFamilyAnnualDeductibleMet: number
    current_maximumFamilyAnnualBenefitUsed: number
    carrierInsurancePlan: Parse.Pointer
    patient: Parse.Pointer
    lastModified: string
    patientInsurancePlans: []
    // INTERNAL FIELDS
    migrationStatus: string
}

const className = 'SubscriberInsurancePlan'
const ascendEndpoint = '/v0/subscriberinsuranceplans'
const complexTypes = [
    { columnName: 'carrierInsurancePlan', className: 'CarrierInsurancePlanV1', shouldIgnore: false },
    { columnName: 'patient', className: 'PatientV1', shouldIgnore: false }
]

export class SubscriberInsurancePlan extends ModelBase<ISubscriberInsurancePlan> {
    
    constructor(attributes: ISubscriberInsurancePlan) {
        super(className, attributes);
        this.ascendEndpoint = ascendEndpoint;
        this.className = className;
    }
    
    async connectComplexTypes() {
        await this.executeConnectComplexTypes(complexTypes, className);
    }

    async syncWithAscend() {
        const newEntries = await this.getAllFromAscend(ascendEndpoint, complexTypes, SubscriberInsurancePlan);
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

Parse.Object.registerSubclass(className, SubscriberInsurancePlan);

const schema = new Parse.Schema(className);
schema.addString('ascend_id')
schema.addBoolean('releaseOfInformation')
schema.addBoolean('assignmentOfBenefits')
schema.addString('planSubscriberId')
schema.addNumber('previous_benefitYear')
schema.addNumber('previous_basicFamilyAnnualDeductibleMet')
schema.addNumber('previous_preventiveFamilyAnnualDeductibleMet')
schema.addNumber('previous_majorFamilyAnnualDeductibleMet')
schema.addNumber('previous_maximumFamilyAnnualBenefitUsed')
schema.addNumber('current_benefitYear')
schema.addNumber('current_basicFamilyAnnualDeductibleMet')
schema.addNumber('current_preventiveFamilyAnnualDeductibleMet')
schema.addNumber('current_majorFamilyAnnualDeductibleMet')
schema.addNumber('current_maximumFamilyAnnualBenefitUsed')
schema.addString('lastModified')
schema.addArray('patientInsurancePlans')
schema.addPointer('carrierInsurancePlan', 'CarrierInsurancePlanV1')
schema.addPointer('patient', 'PatientV1')
schema.addString('migrationStatus')
schema.addString('generatedBy', { required: true })
schema.addString('lastUpdatedBy', { required: true })
schema.addObject('carrierInsurancePlan_ascend')
schema.addObject('patient_ascend')

export { schema as SubscriberInsurancePlanSchema }