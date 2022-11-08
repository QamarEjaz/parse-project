import * as Parse from 'parse/node';
import { ModelBase } from './ModelBase';

export interface IOrganization {
    ascend_id: string
    name: string
    timeZone: string
    email: string
    address1: string
    address2: string
    city: string
    state: string
    postalCode: string
    phone: string
    lastModified: string
    // INTERNAL FIELDS
    migrationStatus: string
}

const className = 'Organization'
const ascendEndpoint = '/v0/organizations'
const complexTypes: any[] = []

export class Organization extends ModelBase<IOrganization> {
    constructor(attributes: IOrganization) {
        super(className, attributes);
        this.useLastId = false;
        this.ascendEndpoint = ascendEndpoint;
        this.className = className;
    }

    async connectComplexTypes() {
        await this.executeConnectComplexTypes(complexTypes, className);
    }

    async syncWithAscend() {
        const newEntries = await this.getAllFromAscend(ascendEndpoint, [], Organization);
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

Parse.Object.registerSubclass(className, Organization);

const schema = new Parse.Schema(className);
schema.addString('ascend_id')
schema.addString('name')
schema.addString('timeZone')
schema.addString('email')
schema.addString('address1')
schema.addString('address2')
schema.addString('city')
schema.addString('state')
schema.addString('postalCode')
schema.addString('phone')
schema.addString('lastModified')
schema.addString('migrationStatus')
schema.addString('generatedBy', { required: true })
schema.addString('lastUpdatedBy', { required: true })

export { schema as OrganizationSchema }