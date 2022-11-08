import * as Parse from 'parse/node';
import { ModelBase } from './ModelBase';

export interface IClaimAttachment {
    ascend_id: string
    attachmentType: string
    attachedDate: string
    dateCreated: string
    neaNumber: string
    document: Parse.Pointer
    insuranceClaim: Parse.Pointer
    // INTERNAL FIELDS
    migrationStatus: string
}

const className = 'ClaimAttachment'
const ascendEndpoint = '/v0/claimattachments'
const complexTypes = [
    { columnName: 'document', className: 'Document', shouldIgnore: false },
    { columnName: 'insuranceClaim', className: 'InsuranceClaim', shouldIgnore: false }
]

export class ClaimAttachment extends ModelBase<IClaimAttachment> {
    constructor(attributes: IClaimAttachment) {
        super(className, attributes);
        this.ascendEndpoint = ascendEndpoint;
        this.className = className;
    }
    
    async connectComplexTypes() {
        await this.executeConnectComplexTypes(complexTypes, className);
    }

    async syncWithAscend() {
        const newEntries = await this.getAllFromAscend(ascendEndpoint, complexTypes, ClaimAttachment);
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

Parse.Object.registerSubclass(className, ClaimAttachment);

const schema = new Parse.Schema(className);
schema.addString('ascend_id')
schema.addString('attachmentType')
schema.addString('attachedDate')
schema.addString('dateCreated')
schema.addString('neaNumber')

schema.addPointer('document', 'Document')
schema.addPointer('insuranceClaim', 'InsuranceClaim')

schema.addString('migrationStatus')
schema.addString('generatedBy', { required: true })
schema.addString('lastUpdatedBy', { required: true })

schema.addObject('document_ascend')
schema.addObject('insuranceClaim_ascend')

export { schema as ClaimAttachmentSchema }