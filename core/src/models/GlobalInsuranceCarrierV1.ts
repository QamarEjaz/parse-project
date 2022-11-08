import * as Parse from 'parse/node';
import { ModelBase } from './ModelBase';

export interface IGlobalInsuranceCarrierV1 {
    ascend_id: string
    name: string	
    payorId: string	
    url: string	
    address1: string	
    address2: string	
    city: string	
    state: string	
    postalCode: string	
    phonePrimary: string	
    phonePrimaryExt: string	
    phoneFax: string	
    neaPayorId: string	
    acceptElectronicAttachments: boolean	
    acceptEligibilities: boolean	
    lastModified: string
    // INTERNAL FIELDS
    migrationStatus: string
}

const className = 'GlobalInsuranceCarrierV1'
const ascendEndpoint = '/v1/globalinsurancecarriers'
const complexTypes: any[] = []

export class GlobalInsuranceCarrierV1 extends ModelBase<IGlobalInsuranceCarrierV1> {
    constructor(attributes: IGlobalInsuranceCarrierV1) {
        super(className, attributes);
        this.useLastId = true;
        this.lastId = '0';
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
        const newEntries = await this.getAllFromAscend(ascendEndpoint, [], GlobalInsuranceCarrierV1);
        return newEntries;
    }
}

Parse.Object.registerSubclass(className, GlobalInsuranceCarrierV1);

const schema = new Parse.Schema(className);

schema.addString('ascend_id')
schema.addString('name')	
schema.addString('payorId')	
schema.addString('url')	
schema.addString('address1')	
schema.addString('address2')	
schema.addString('city')	
schema.addString('state')	
schema.addString('postalCode')	
schema.addString('phonePrimary')	
schema.addString('phonePrimaryExt')	
schema.addString('phoneFax')	
schema.addString('neaPayorId')	
schema.addBoolean('acceptElectronicAttachments')	
schema.addBoolean('acceptEligibilities')	
schema.addString('lastModified')
schema.addString('migrationStatus')
schema.addString('generatedBy', { required: true })
schema.addString('lastUpdatedBy', { required: true })

export { schema as GlobalInsuranceCarrierV1Schema }