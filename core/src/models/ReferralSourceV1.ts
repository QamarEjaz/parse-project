import * as Parse from 'parse/node';
import { ModelBase } from './ModelBase';

export interface IReferralSourceV1 {
    ascend_id: string
    firstName: string
    middleInitial: string
    lastName: string
    title: string
    specialty: string
    referralSourceType: string
    note: string
    npi: string
    stateId: string
    address1: string
    address2: string
    city: string
    state: string
    postalCode: string
    phone1_number: string
    phone1_type: string
    phone1_extension: string
    phone2_number: string
    phone2_type: string
    phone2_extension: string
    phone3_number: string
    phone3_type: string
    phone3_extension: string
    email: string
    lastModified: string
    // INTERNAL FIELDS
    migrationStatus: string
}

const className = 'ReferralSourceV1'
const ascendEndpoint = '/v1/referralsources'
const complexTypes: any[] = []

export class ReferralSourceV1 extends ModelBase<IReferralSourceV1> {
    
    constructor(attributes: IReferralSourceV1) {
        super(className, attributes);
        this.ascendEndpoint = ascendEndpoint;
        this.className = className;
    }
    
    async connectComplexTypes() {
        await this.executeConnectComplexTypes(complexTypes, className);
    }
    
    async syncWithAscend() {
        const newEntries = await this.getAllFromAscend(ascendEndpoint, [], ReferralSourceV1);
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

Parse.Object.registerSubclass(className, ReferralSourceV1);

const schema = new Parse.Schema(className);
schema.addString('ascend_id')
schema.addString('firstName')
schema.addString('middleInitial')
schema.addString('lastName')
schema.addString('title')
schema.addString('specialty')
schema.addString('referralSourceType')
schema.addString('note')
schema.addString('npi')
schema.addString('stateId')
schema.addString('address1')
schema.addString('address2')
schema.addString('city')
schema.addString('state')
schema.addString('postalCode')
schema.addString('phone1_number')
schema.addString('phone1_type')
schema.addString('phone1_extension')
schema.addString('phone2_number')
schema.addString('phone2_type')
schema.addString('phone2_extension')
schema.addString('phone3_number')
schema.addString('phone3_type')
schema.addString('phone3_extension')
schema.addString('email')
schema.addString('lastModified')
schema.addString('migrationStatus')
schema.addString('generatedBy', { required: true })
schema.addString('lastUpdatedBy', { required: true })

export { schema as ReferralSourceV1Schema }


