import * as Parse from 'parse/node';
import { ModelBase } from './ModelBase';

interface ISnodent {
    id: number
    code: string
    description: string
}

interface IIcd10 {
    id: number
    code: string
    description: string
}

interface IRestriction {
    id: number
    maxSelectedSurfacesCount: number
    mesial: boolean
    incisal: boolean
    occlusal: boolean
    distal: boolean
    lingual: boolean
    facial: boolean
    buccal: boolean
}

interface ICondition {
    id: number
    snomedCode: string
    snodent: ISnodent
    abbreviatedDescription: string
    treatmentArea: string
    favorite: boolean
    icd10: IIcd10
    restriction: IRestriction
}

export interface IOrganizationConditionV1 {
    ascend_id: string
    favorite: boolean
    isActive: boolean
    description: string
    condition: ICondition
    // INTERNAL FIELDS
    migrationStatus: string
}

const className = 'OrganizationConditionV1'
const ascendEndpoint = '/v1/organizationconditions'
const complexTypes: any[] = []

export class OrganizationConditionV1 extends ModelBase<IOrganizationConditionV1> {
    
    constructor(attributes: IOrganizationConditionV1) {
        super(className, attributes);
        this.ascendEndpoint = ascendEndpoint;
        this.className = className;
    }
    
    async connectComplexTypes() {
        await this.executeConnectComplexTypes(complexTypes, className);
    }

    async syncWithAscend() {
        const newEntries = await this.getAllFromAscend(ascendEndpoint, [], OrganizationConditionV1);
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

Parse.Object.registerSubclass(className, OrganizationConditionV1);

const schema = new Parse.Schema(className);
schema.addString('ascend_id')
schema.addBoolean('favorite')
schema.addBoolean('isActive')
schema.addString('description')
schema.addObject('condition')
schema.addString('migrationStatus')
schema.addString('generatedBy', { required: true })
schema.addString('lastUpdatedBy', { required: true })

export { schema as OrganizationConditionV1Schema }