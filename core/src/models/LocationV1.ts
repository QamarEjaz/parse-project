import { ModelBase } from './ModelBase';
import * as Parse from 'parse/node';
import { locationRoles } from '../common/RoleDefinations';

interface locationRole{
    role: string,
    type: locationRoles
}

export interface ILocationV1 {
    ascend_id: string
    name: string
    abbreviation: string
    taxPercentage: number
    timeZone: string
    website: string
    email: string
    phone: string
    address1: string
    address2: string
    city: string
    state: string
    postalCode: string
    billing_entityEnabled: boolean
    billing_name: string
    billing_address1: string
    billing_address2: string
    billing_city: string
    billing_state: string
    billing_postalCode: string
    billing_phone: string
    image: Parse.File
    provider: Parse.Pointer
    feeSchedule: Parse.Pointer
    lastModified: string
    roles: locationRole[]
    // INTERNAL FIELDS
    migrationStatus: string
    longitude: number
    latitude: number
    isActive: boolean
    isWelcomeCenter: boolean
    isRemote: boolean
}

const ascendEndpoint = '/v1/locations'
const complexTypes = [
    { columnName: 'provider', className: 'ProviderV1', shouldIgnore: false, isPointer: true },
    { columnName: 'feeSchedule', className: 'FeeScheduleV1', shouldIgnore: false, isPointer: true }
]

export class LocationV1 extends ModelBase<ILocationV1> {
    static className = "LocationV1";

    async connectComplexTypes() {
        await this.executeConnectComplexTypes(complexTypes, LocationV1.className);
    }

    constructor(attributes: ILocationV1) {
        super(LocationV1.className, attributes);
        this.ascendEndpoint = ascendEndpoint;
        this.className = LocationV1.className;
    }

    async syncWithAscend() {
        const newEntries = await this.getAllFromAscend(ascendEndpoint, complexTypes, LocationV1);
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

Parse.Object.registerSubclass(LocationV1.className, LocationV1);

const schema = new Parse.Schema(LocationV1.className);

schema.addString('ascend_id')
schema.addString('name')
schema.addString('abbreviation')
schema.addNumber('taxPercentage')
schema.addString('timeZone')
schema.addString('website')
schema.addString('email')
schema.addString('phone')
schema.addString('address1')
schema.addString('address2')
schema.addString('city')
schema.addString('state')
schema.addString('postalCode')
schema.addBoolean('billing_entityEnabled')
schema.addString('billing_name')
schema.addString('billing_address1')
schema.addString('billing_address2')
schema.addString('billing_city')
schema.addString('billing_state')
schema.addString('billing_postalCode')
schema.addString('billing_phone')
schema.addFile('image')
schema.addString('lastModified')
schema.addArray('roles')
schema.addNumber('longitude')
schema.addNumber('latitude')
schema.addPointer('provider', 'ProviderV1')
schema.addPointer('feeSchedule', 'FeeScheduleV1')
schema.addString('migrationStatus')
schema.addString('generatedBy', { required: true })
schema.addString('lastUpdatedBy', { required: true })
schema.addObject('provider_ascend')
schema.addObject('feeSchedule_ascend')
schema.addPointer('welcomeCenterLocation', 'LocationV1')
schema.addBoolean('isActive', {required: true, defaultValue: true})
schema.addBoolean('isWelcomeCenter', {required: true, defaultValue: false})
schema.addBoolean('isRemote', {required: true, defaultValue: false})

export { schema as LocationV1Schema }
