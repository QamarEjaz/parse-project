import * as Parse from 'parse/node';
import { ModelBase } from './ModelBase';

interface IConditionTooth {
    toothId: string
    mesial: boolean
    incisal: boolean
    occlusal: boolean
    distal: boolean
    facial: boolean
    buccal: boolean
}

export interface IPatientConditionV1 {
    ascend_id: string
    status: string
    state: string
    note: string
    serviceDate: string
    chartedDate: string
    oralCavityType: string
    conditionTooth: IConditionTooth

    provider: Parse.Pointer
    chartedProvider: Parse.Pointer
    organizationCondition: Parse.Pointer
    patient: Parse.Pointer
    // INTERNAL FIELDS
    migrationStatus: string
}

const className = 'PatientConditionV1'
const ascendEndpoint = '/v1/patientconditions'
const complexTypes = [
    { columnName: 'provider', className: 'ProviderV1', shouldIgnore: false },
    { columnName: 'chartedProvider', className: 'ProviderV1', shouldIgnore: false },
    { columnName: 'organizationCondition', className: 'OrganizationConditionV1', shouldIgnore: false },
    { columnName: 'patient', className: 'PatientV1', shouldIgnore: false }
]

export class PatientConditionV1 extends ModelBase<IPatientConditionV1> {
    
    constructor(attributes: IPatientConditionV1) {
        super(className, attributes);
        this.ascendEndpoint = ascendEndpoint;
        this.className = className;
    }
    
    async connectComplexTypes() {
        await this.executeConnectComplexTypes(complexTypes, className);
    }

    async syncWithAscend() {
        const newEntries = await this.getAllFromAscend(ascendEndpoint, complexTypes, PatientConditionV1);
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

Parse.Object.registerSubclass(className, PatientConditionV1);

const schema = new Parse.Schema(className);
schema.addString('ascend_id')
schema.addString('status')
schema.addString('state')
schema.addString('note')
schema.addString('serviceDate')
schema.addString('chartedDate')
schema.addString('oralCavityType')
schema.addObject('conditionTooth')

schema.addPointer('provider', 'ProviderV1')
schema.addPointer('chartedProvider', 'ProviderV1')
schema.addPointer('organizationCondition', 'OrganizationConditionV1')
schema.addPointer('patient', 'PatientV1')
schema.addString('migrationStatus')
schema.addString('generatedBy', { required: true })
schema.addString('lastUpdatedBy', { required: true })
schema.addObject('provider_ascend')
schema.addObject('chartedProvider_ascend')
schema.addObject('organizationCondition_ascend')
schema.addObject('patient_ascend')

export { schema as PatientConditionV1Schema }