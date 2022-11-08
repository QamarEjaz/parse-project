import * as Parse from 'parse/node';
import { ModelBase } from './ModelBase';

interface IStorage {
    thumbnail: string
    original: string
    resized: string
    cropped: string
}

export interface IDocument {
    ascend_id: string
    name: string
    tags: []
    thumbNailId: string
    mimeType: string
    guidName: string
    ownerType: string
    storage: IStorage
    ownerPatient: Parse.Pointer
    ownerPerioExam: Parse.Pointer
    ownerOrganization: Parse.Pointer
    file: Parse.File
    // INTERNAL FIELDS
    migrationStatus: string
}

const className = 'Document'
const ascendEndpoint = '/v0/documents'
const complexTypes = [
    { columnName: 'ownerPatient', className: 'PatientV1', shouldIgnore: false },
    { columnName: 'ownerPerioExam', className: 'PerioExam', shouldIgnore: false },
    { columnName: 'ownerOrganization', className: 'Organization', shouldIgnore: false }
]

export class Document extends ModelBase<IDocument> {

    constructor(attributes: IDocument) {
        super(className, attributes);
        this.ascendEndpoint = ascendEndpoint;
        this.className = className;
    }

    async connectComplexTypes() {
        await this.executeConnectComplexTypes(complexTypes, className);
    }

    async syncWithAscend() {
        const newEntries = await this.getAllFromAscend(ascendEndpoint, complexTypes, Document);
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

Parse.Object.registerSubclass(className, Document);

const schema = new Parse.Schema(className);
schema.addString('ascend_id')
schema.addString('name')
schema.addArray('tags')
schema.addString('thumbNailId')
schema.addString('mimeType')
schema.addString('guidName')
schema.addString('ownerType')
schema.addObject('storage')

schema.addPointer('ownerPatient', 'PatientV1')
schema.addPointer('ownerPerioExam', 'PerioExam')
schema.addPointer('ownerOrganization', 'Organization')
schema.addFile('file')

schema.addString('migrationStatus')
schema.addString('generatedBy', { required: true })
schema.addString('lastUpdatedBy', { required: true })

schema.addObject('ownerPatient_ascend')
schema.addObject('ownerPerioExam_ascend')
schema.addObject('ownerOrganization_ascend')

export { schema as DocumentSchema }