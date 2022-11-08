import * as Parse from 'parse/node';
import { ModelBase } from './ModelBase';

export interface IClinicalNote {
    ascend_id: string
    datedAs: string
    signedDate: string
    signedAdditionalDate: string
    text: string
    lastModified: string

    draftTemplateOptions: any
    assignedTeeth: any[]
    addendums: any[]

    additionalProvider: Parse.Pointer
    primarySignature: Parse.Pointer
    additionalSignature: Parse.Pointer
    provider: Parse.Pointer
    patient: Parse.Pointer
    
    // INTERNAL FIELDS
    migrationStatus: string
}

const className = 'ClinicalNote'
const ascendEndpoint = '/v0/clinicalnotes'
const complexTypes: any[] = [
    { columnName: 'additionalProvider', className: 'ProviderV1', shouldIgnore: false },
    { columnName: 'primarySignature', className: 'Signature', shouldIgnore: false },
    { columnName: 'additionalSignature', className: 'Signature', shouldIgnore: false },
    { columnName: 'provider', className: 'ProviderV1', shouldIgnore: false },
    { columnName: 'patient', className: 'PatientV1', shouldIgnore: false },
]

export class ClinicalNote extends ModelBase<IClinicalNote> {
    constructor(attributes: IClinicalNote) {
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
        const newEntries = await this.getAllFromAscend(ascendEndpoint, complexTypes, ClinicalNote);
        return newEntries;
    }
}

Parse.Object.registerSubclass(className, ClinicalNote);

const schema = new Parse.Schema(className);

schema.addString('ascend_id')
schema.addString('datedAs')
schema.addString('signedDate')
schema.addString('signedAdditionalDate')
schema.addString('text')
schema.addString('lastModified')


schema.addObject('draftTemplateOptions')
schema.addArray('assignedTeeth')
schema.addArray('addendums')

schema.addPointer('additionalProvider', 'ProviderV1')
schema.addPointer('primarySignature', 'Signature')
schema.addPointer('additionalSignature', 'Signature')
schema.addPointer('provider', 'ProviderV1')
schema.addPointer('patient', 'PatientV1')

// INTERNAL FIELDS
schema.addString('migrationStatus')
schema.addString('generatedBy', { required: true })
schema.addString('lastUpdatedBy', { required: true })

schema.addObject('additionalProvider_ascend')
schema.addObject('primarySignature_ascend')
schema.addObject('additionalSignature_ascend')
schema.addObject('provider_ascend')
schema.addObject('patient_ascend')

export { schema as ClinicalNoteSchema }