import * as Parse from 'parse/node';
import { ModelBase } from './ModelBase';

export interface IInsuranceCarrierV1 {
    ascend_id: string
    name: string
    phonePrimary: string
    phonePrimaryExt: string
    phoneFax: string
    url: string
    payorId: string
    acceptElectronicAttachments: boolean
    acceptEligibilities: boolean
    adaReportType: string
    globalInsuranceCarrier: Parse.Pointer
    lastModified: string
    // INTERNAL FIELDS
    migrationStatus: string
}

const className = 'InsuranceCarrierV1'
const ascendEndpoint = '/v1/insurancecarriers'
const complexTypes = [
    { columnName: 'globalInsuranceCarrier', className: 'GlobalInsuranceCarrierV1', shouldIgnore: false },
]

export class InsuranceCarrierV1 extends ModelBase<IInsuranceCarrierV1> {
    async connectComplexTypes() {
        await this.executeConnectComplexTypes(complexTypes, className);
    }

    async syncWithAscend() {
        const newEntries = await this.getAllFromAscend(ascendEndpoint, complexTypes, InsuranceCarrierV1);
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

    constructor(attributes: IInsuranceCarrierV1) {
        super(className, attributes);
        this.ascendEndpoint = ascendEndpoint;
        this.className = className;
    }
}

Parse.Object.registerSubclass(className, InsuranceCarrierV1);

const schema = new Parse.Schema(className);

schema.addString('ascend_id');
schema.addString('name');
schema.addString('phonePrimary');
schema.addString('phonePrimaryExt');
schema.addString('phoneFax');
schema.addString('url');
schema.addString('payorId');
schema.addBoolean('acceptElectronicAttachments');
schema.addBoolean('acceptEligibilities');
schema.addString('adaReportType');
schema.addString('lastModified');
schema.addPointer('globalInsuranceCarrier', 'GlobalInsuranceCarrierV1');
schema.addString('migrationStatus')
schema.addString('generatedBy', { required: true })
schema.addString('lastUpdatedBy', { required: true })
schema.addObject('globalInsuranceCarrier_ascend')

export { schema as InsuranceCarrierV1Schema }