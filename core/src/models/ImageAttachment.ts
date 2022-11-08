import * as Parse from 'parse/node';
import { ModelBase } from './ModelBase';

export interface IImageAttachment {
    ascend_id: string
    examId: string
    examImageId: string
    examName: string
    examDate: string
    examImageOutputFormat: string
    examImageSizeInBytes: number
    examImageTreatments: string
    attachmentType: string
    attachedDate: string
    dateCreated: string
    neaNumber: string
    insuranceClaim: Parse.Pointer
    // INTERNAL FIELDS
    migrationStatus: string
}

const className = 'ImageAttachment'
const ascendEndpoint = '/v0/imageattachments'
const complexTypes = [
    { columnName: 'insuranceClaim', className: 'InsuranceClaim', shouldIgnore: false }
]

export class ImageAttachment extends ModelBase<IImageAttachment> {
    async connectComplexTypes() {
        await this.executeConnectComplexTypes(complexTypes, className);
    }

    async syncWithAscend() {
        const newEntries = await this.getAllFromAscend(ascendEndpoint, complexTypes, ImageAttachment);
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

    constructor(attributes: IImageAttachment) {
        super(className, attributes);
        this.ascendEndpoint = ascendEndpoint;
        this.className = className;
    }
}

Parse.Object.registerSubclass(className, ImageAttachment);

const schema = new Parse.Schema(className);
schema.addString('ascend_id')
schema.addString('examId')
schema.addString('examImageId')
schema.addString('examName')
schema.addString('examDate')
schema.addString('examImageOutputFormat')
schema.addNumber('examImageSizeInBytes')
schema.addString('examImageTreatments')
schema.addString('attachmentType')
schema.addString('attachedDate')
schema.addString('dateCreated')
schema.addString('neaNumber')
schema.addPointer('insuranceClaim', 'InsuranceClaim')
schema.addString('migrationStatus')
schema.addString('generatedBy', { required: true })
schema.addString('lastUpdatedBy', { required: true })
schema.addObject('insuranceClaim_ascend')

export { schema as ImageAttachmentSchema }