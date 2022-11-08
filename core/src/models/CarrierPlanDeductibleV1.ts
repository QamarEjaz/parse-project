import * as Parse from 'parse/node';
import { ModelBase } from './ModelBase';

export interface ICarrierPlanDeductibleV1 {
    ascend_id: string
    coverageType: string
    noDuplicationOfBenefitsClause: boolean
    previous_benefitYear: number
    previous_basicIndividualLifetimeDeductible: number
    previous_basicIndividualAnnualDeductible: number
    previous_basicFamilyAnnualDeductible: number
    previous_preventiveIndividualLifetimeDeductible: number
    previous_preventiveIndividualAnnualDeductible: number
    previous_preventiveFamilyAnnualDeductible: number
    previous_majorIndividualLifetimeDeductible: number
    previous_majorIndividualAnnualDeductible: number
    previous_majorFamilyAnnualDeductible: number
    previous_orthoIndividualLifetimeDeductible: number
    previous_orthoIndividualAnnualDeductible: number
    previous_maximumIndividualAnnualBenefit: number
    previous_maximumFamilyAnnualBenefit: number
    previous_maximumOrthoLifetimeBenefit: number
    current_benefitYear: number
    current_basicIndividualLifetimeDeductible: number
    current_basicIndividualAnnualDeductible: number
    current_basicFamilyAnnualDeductible: number
    current_preventiveIndividualLifetimeDeductible: number
    current_preventiveIndividualAnnualDeductible: number
    current_preventiveFamilyAnnualDeductible: number
    current_majorIndividualLifetimeDeductible: number
    current_majorIndividualAnnualDeductible: number
    current_majorFamilyAnnualDeductible: number
    current_orthoIndividualLifetimeDeductible: number
    current_orthoIndividualAnnualDeductible: number
    current_maximumIndividualAnnualBenefit: number
    current_maximumFamilyAnnualBenefit: number
    current_maximumOrthoLifetimeBenefit: number
    lastModified: string
    // INTERNAL FIELDS
    migrationStatus: string
}

const className = 'CarrierPlanDeductibleV1'
const ascendEndpoint = '/v1/carrierplandeductibles'
const complexTypes: any[] = []

export class CarrierPlanDeductibleV1 extends ModelBase<ICarrierPlanDeductibleV1> {
    constructor(attributes: ICarrierPlanDeductibleV1) {
        super(className, attributes);
        this.ascendEndpoint = ascendEndpoint;
        this.className = className;
    }
    
    async connectComplexTypes() {
        await this.executeConnectComplexTypes(complexTypes, className);
    }

    async syncWithAscend() {
        const newEntries = await this.getAllFromAscend(ascendEndpoint, [], CarrierPlanDeductibleV1);
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

Parse.Object.registerSubclass(className, CarrierPlanDeductibleV1);

const schema = new Parse.Schema(className);
schema.addString('ascend_id')
schema.addString('coverageType')
schema.addBoolean('noDuplicationOfBenefitsClause')
schema.addNumber('previous_benefitYear')
schema.addNumber('previous_basicIndividualLifetimeDeductible')
schema.addNumber('previous_basicIndividualAnnualDeductible')
schema.addNumber('previous_basicFamilyAnnualDeductible')
schema.addNumber('previous_preventiveIndividualLifetimeDeductible')
schema.addNumber('previous_preventiveIndividualAnnualDeductible')
schema.addNumber('previous_preventiveFamilyAnnualDeductible')
schema.addNumber('previous_majorIndividualLifetimeDeductible')
schema.addNumber('previous_majorIndividualAnnualDeductible')
schema.addNumber('previous_majorFamilyAnnualDeductible')
schema.addNumber('previous_orthoIndividualLifetimeDeductible')
schema.addNumber('previous_orthoIndividualAnnualDeductible')
schema.addNumber('previous_maximumIndividualAnnualBenefit')
schema.addNumber('previous_maximumFamilyAnnualBenefit')
schema.addNumber('previous_maximumOrthoLifetimeBenefit')
schema.addNumber('current_benefitYear')
schema.addNumber('current_basicIndividualLifetimeDeductible')
schema.addNumber('current_basicIndividualAnnualDeductible')
schema.addNumber('current_basicFamilyAnnualDeductible')
schema.addNumber('current_preventiveIndividualLifetimeDeductible')
schema.addNumber('current_preventiveIndividualAnnualDeductible')
schema.addNumber('current_preventiveFamilyAnnualDeductible')
schema.addNumber('current_majorIndividualLifetimeDeductible')
schema.addNumber('current_majorIndividualAnnualDeductible')
schema.addNumber('current_majorFamilyAnnualDeductible')
schema.addNumber('current_orthoIndividualLifetimeDeductible')
schema.addNumber('current_orthoIndividualAnnualDeductible')
schema.addNumber('current_maximumIndividualAnnualBenefit')
schema.addNumber('current_maximumFamilyAnnualBenefit')
schema.addNumber('current_maximumOrthoLifetimeBenefit')
schema.addString('lastModified')
schema.addString('generatedBy', { required: true })
schema.addString('lastUpdatedBy', { required: true })

schema.addString('migrationStatus')

export { schema as CarrierPlanDeductibleV1Schema }