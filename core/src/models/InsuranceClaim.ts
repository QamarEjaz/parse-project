import * as Parse from 'parse/node';
import { ModelBase } from './ModelBase';

export interface IInsuranceClaim {
    ascend_id: string
    type: string
    placeOfTreatment: string
    unusualServicesRemarks: string
    accidentType: string
    accidentState: string
    accidentDate: string
    priorAuthorizationNumber: string
    procedures: Parse.Relation
    referral: Parse.Pointer
    billingProvider: Parse.Pointer
    renderingProvider: Parse.Pointer
    totalCharges: number
    patientAmountPaid: number
    amountPaid: number
    appliancePlacementDate: string
    serviceDate: string
    originalReferenceNumber: string
    referralNumber: string
    payorName: string
    payorId: string
    groupPlanName: string
    groupNumber: string
    subscriberNumber: string
    releaseOfInformation: boolean
    assignmentOfBenefits: boolean
    isPredetermination: boolean
    paymentResponsibilityOrder: number
    relationshipToSubscriber: string
    claimState: string
    lastUpdateDate: string
    statusSource: string
    messageTxt: string
    payerRequestedResubmit: boolean
    payerRequestedVoid: boolean
    created: string
    resubmitDate: string
    voidedDate: string
    sentDate: string
    orthoMonthsRemaining: number
    orthoTotalMonths: number
    followupDueDate: string
    claimFollowupAction: string
    attachmentReferenceNumber: string
    isActive: boolean
    eTransClaimId: string
    payTo_address1: string
    payTo_address2: string
    payTo_city: string
    payTo_state: string
    payTo_postalCode: string
    rendering_address1: string
    rendering_address2: string
    rendering_city: string
    rendering_state: string
    rendering_postalCode: string
    payTo_phoneType: string
    payTo_phoneNumber: string
    payTo_phoneExtension: string
    claimStatusHistory: []
    // TO BE FIGURED OUT (TEMPSOLVE)
    // insurancePayments: Parse.Relation
    insurancePayments: any
    patient: Parse.Pointer
    subscriber: Parse.Pointer
    payToProvider: Parse.Pointer
    insuranceCarrier: Parse.Pointer
    carrierInsurancePlan: Parse.Pointer
    patientInsurancePlan: Parse.Pointer
    location: Parse.Pointer
    // OBJECT TO BE FIGURED OUT (TEMPSOLVE)
    // claimDiagnosisCode: 
    claimDiagnosisCode: any
    lastModified: string
    imageAttachments: Parse.Relation
    claimAttachments: Parse.Relation
    // INTERNAL FIELDS
    migrationStatus: string
}

const className = 'InsuranceClaim'
const ascendEndpoint = '/v0/insuranceclaims'
const complexTypes = [
    // TO BE FIGURED OUT (TEMPSOLVE) once figured set shouldIgnore to false
    { columnName: 'insurancePayments', className: '????', shouldIgnore: true, isRelation: true },
    { columnName: 'claimDiagnosisCode', className: '????', shouldIgnore: true, isRelation: false },
    
    { columnName: 'procedures', className: 'PatientProcedureV1', shouldIgnore: false, isRelation: true },
    { columnName: 'referral', className: 'ReferralSourceV1', shouldIgnore: false },
    { columnName: 'billingProvider', className: 'ProviderV1', shouldIgnore: false },
    { columnName: 'renderingProvider', className: 'ProviderV1', shouldIgnore: false },
    { columnName: 'patient', className: 'PatientV1', shouldIgnore: false },
    { columnName: 'subscriber', className: 'PatientV1', shouldIgnore: false },
    { columnName: 'payToProvider', className: 'ProviderV1', shouldIgnore: false },
    { columnName: 'insuranceCarrier', className: 'InsuranceCarrierV1', shouldIgnore: false },
    { columnName: 'carrierInsurancePlan', className: 'CarrierInsurancePlanV1', shouldIgnore: false },
    { columnName: 'patientInsurancePlan', className: 'PatientInsurancePlan', shouldIgnore: false },
    { columnName: 'location', className: 'LocationV1', shouldIgnore: false },
    { columnName: 'imageAttachments', className: 'ImageAttachment', shouldIgnore: false, isRelation: true },
    { columnName: 'claimAttachments', className: 'ClaimAttachment', shouldIgnore: false, isRelation: true },
]

export class InsuranceClaim extends ModelBase<IInsuranceClaim> {
    async connectComplexTypes() {
        await this.executeConnectComplexTypes(complexTypes, className);
    }

    async syncWithAscend() {
        const newEntries = await this.getAllFromAscend(ascendEndpoint, complexTypes, InsuranceClaim);
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

    constructor(attributes: IInsuranceClaim) {
        super(className, attributes);
        this.ascendEndpoint = ascendEndpoint;
        this.className = className;
    }
}

Parse.Object.registerSubclass(className, InsuranceClaim);

const schema = new Parse.Schema(className);
schema.addString('ascend_id')
schema.addString('type')
schema.addString('placeOfTreatment')
schema.addString('unusualServicesRemarks')
schema.addString('accidentType')
schema.addString('accidentState')
schema.addString('accidentDate')
schema.addString('priorAuthorizationNumber')
schema.addNumber('totalCharges')
schema.addNumber('patientAmountPaid')
schema.addNumber('amountPaid')
schema.addString('appliancePlacementDate')
schema.addString('serviceDate')
schema.addString('originalReferenceNumber')
schema.addString('referralNumber')
schema.addString('payorName')
schema.addString('payorId')
schema.addString('groupPlanName')
schema.addString('groupNumber')
schema.addString('subscriberNumber')
schema.addBoolean('releaseOfInformation')
schema.addBoolean('assignmentOfBenefits')
schema.addBoolean('isPredetermination')
schema.addNumber('paymentResponsibilityOrder')
schema.addString('relationshipToSubscriber')
schema.addString('claimState')
schema.addString('lastUpdateDate')
schema.addString('statusSource')
schema.addString('messageTxt')
schema.addBoolean('payerRequestedResubmit')
schema.addBoolean('payerRequestedVoid')
schema.addString('created')
schema.addString('resubmitDate')
schema.addString('voidedDate')
schema.addString('sentDate')
schema.addNumber('orthoMonthsRemaining')
schema.addNumber('orthoTotalMonths')
schema.addString('followupDueDate')
schema.addString('claimFollowupAction')
schema.addString('attachmentReferenceNumber')
schema.addBoolean('isActive')
schema.addString('eTransClaimId')
schema.addString('payTo_address1')
schema.addString('payTo_address2')
schema.addString('payTo_city')
schema.addString('payTo_state')
schema.addString('payTo_postalCode')
schema.addString('rendering_address1')
schema.addString('rendering_address2')
schema.addString('rendering_city')
schema.addString('rendering_state')
schema.addString('rendering_postalCode')
schema.addString('payTo_phoneType')
schema.addString('payTo_phoneNumber')
schema.addString('payTo_phoneExtension')
schema.addArray('claimStatusHistory')
schema.addString('lastModified')

schema.addRelation('procedures', 'PatientProcedureV1')
schema.addPointer('referral', 'ReferralSourceV1')
schema.addPointer('billingProvider', 'ProviderV1')
schema.addPointer('renderingProvider', 'ProviderV1')
// TO BE FIGURED OUT (TEMPSOLVE)
// schema.addRelation('insurancePayments', '????')
schema.addArray('insurancePayments')
schema.addPointer('patient', 'PatientV1')
schema.addPointer('subscriber', 'PatientV1')
schema.addPointer('payToProvider', 'ProviderV1')
schema.addPointer('insuranceCarrier', 'InsuranceCarrierV1')
schema.addPointer('carrierInsurancePlan', 'CarrierInsurancePlanV1')
schema.addPointer('patientInsurancePlan', 'PatientInsurancePlan')
schema.addPointer('location', 'LocationV1')
// TO BE FIGURED OUT (TEMPSOLVE)
schema.addObject('claimDiagnosisCode')
schema.addRelation('imageAttachments', 'ImageAttachment')
schema.addRelation('claimAttachments', 'ClaimAttachment')
schema.addString('migrationStatus')
schema.addString('generatedBy', { required: true })
schema.addString('lastUpdatedBy', { required: true })
schema.addArray('procedures_ascend')
schema.addObject('referral_ascend')
schema.addObject('billingProvider_ascend')
schema.addObject('renderingProvider_ascend')
schema.addObject('patient_ascend')
schema.addObject('subscriber_ascend')
schema.addObject('payToProvider_ascend')
schema.addObject('insuranceCarrier_ascend')
schema.addObject('carrierInsurancePlan_ascend')
schema.addObject('patientInsurancePlan_ascend')
schema.addObject('location_ascend')
schema.addArray('imageAttachments_ascend')
schema.addArray('claimAttachments_ascend')

export { schema as InsuranceClaimSchema }