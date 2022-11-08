import * as Parse from 'parse/node';
import { ModelBase } from './ModelBase';

export interface IScheduleTemplateApptReason {
    ascend_id: string
    reason: string
    durationMinutes: number
    location: Parse.Pointer
    lastModified: string
    type: string
    // INTERNAL FIELDS
    migrationStatus: string
}

const className = 'ScheduleTemplateApptReason'
const ascendEndpoint = '/v0/scheduletemplateappointmentreasons'
const complexTypes = [
    { columnName: 'location', className: 'LocationV1', shouldIgnore: false },
]

export class ScheduleTemplateApptReason extends ModelBase<IScheduleTemplateApptReason> {
    
    constructor(attributes: IScheduleTemplateApptReason) {
        super(className, attributes);
        this.ascendEndpoint = ascendEndpoint;
        this.className = className;
    }
    
    async connectComplexTypes() {
        await this.executeConnectComplexTypes(complexTypes, className);
    }

    async syncWithAscend() {
        const newEntries = await this.getAllFromAscend(ascendEndpoint, complexTypes, ScheduleTemplateApptReason);
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

Parse.Object.registerSubclass(className, ScheduleTemplateApptReason);

const schema = new Parse.Schema(className);
schema.addString('ascend_id')
schema.addNumber('durationMinutes')
schema.addPointer('location', 'LocationV1')
schema.addString('type')
schema.addString('reason')
schema.addString('lastModified')
schema.addString('migrationStatus')
schema.addString('generatedBy', { required: true })
schema.addString('lastUpdatedBy', { required: true })
schema.addObject('location_ascend')

export { schema as ScheduleTemplateApptReasonSchema }