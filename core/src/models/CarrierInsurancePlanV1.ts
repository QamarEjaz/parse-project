import * as Parse from 'parse/node';
import { ModelBase } from './ModelBase';

interface ILocationId {
    ppoFeeSchedule: Parse.Pointer
}

interface ILocationPlans {

}

export interface ICarrierInsurancePlanV1 {
    ascend_id: string
    planName: string
    renewalMonth: string
    sourceOfPayment: string
    contactName: string
    contactEmail: string
    groupNumber: string
    phone: string
    phoneExt: string
    planType: string
    faxNumber: string
    planNote: string
    address1: string
    address2: string
    city: string
    postalCode: string
    state: string
    // OBJECT TO BE FIGURED OUT
    locationPlans: any
    insuranceCarrier: Parse.Pointer
    carrierPlanDeductible: Parse.Pointer
    lastModified: string
    // INTERNAL FIELDS
    migrationStatus: string
}

const className = 'CarrierInsurancePlanV1'
const ascendEndpoint = '/v1/carrierinsuranceplans'
const complexTypes = [
    { columnName: 'locationPlans', className: 'FeeScheduleV1', shouldIgnore: true },
    { columnName: 'insuranceCarrier', className: 'InsuranceCarrierV1', shouldIgnore: false },
    { columnName: 'carrierPlanDeductible', className: 'CarrierPlanDeductibleV1', shouldIgnore: false },
]

export class CarrierInsurancePlanV1 extends ModelBase<ICarrierInsurancePlanV1> {
    constructor(attributes: ICarrierInsurancePlanV1) {
        super(className, attributes);
        this.ascendEndpoint = ascendEndpoint;
        this.className = className;
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

    async connectComplexTypes() {
        await this.executeConnectComplexTypes(complexTypes, className);
    }

    async syncWithAscend() {
        const newEntries = await this.getAllFromAscend(ascendEndpoint, complexTypes, CarrierInsurancePlanV1);
        return newEntries;
    }
}

Parse.Object.registerSubclass(className, CarrierInsurancePlanV1);

const schema = new Parse.Schema(className);
schema.addString('ascend_id')
schema.addString('planName')
schema.addString('renewalMonth')
schema.addString('sourceOfPayment')
schema.addString('contactName')
schema.addString('contactEmail')
schema.addString('groupNumber')
schema.addString('phone')
schema.addString('phoneExt')
schema.addString('planType')
schema.addString('faxNumber')
schema.addString('planNote')
schema.addString('address1')
schema.addString('address2')
schema.addString('city')
schema.addString('postalCode')
schema.addString('state')
schema.addString('lastModified')
schema.addObject('locationPlans')

schema.addPointer('insuranceCarrier', 'InsuranceCarrierV1')
schema.addPointer('carrierPlanDeductible', 'CarrierPlanDeductibleV1')

schema.addString('migrationStatus')
schema.addString('generatedBy', { required: true })
schema.addString('lastUpdatedBy', { required: true })

schema.addObject('locationPlans_ascend')
schema.addObject('insuranceCarrier_ascend')
schema.addObject('carrierPlanDeductible_ascend')

export { schema as CarrierInsurancePlanV1Schema }