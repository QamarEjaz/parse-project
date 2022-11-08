import * as Parse from 'parse/node';
import { ModelBase } from './ModelBase';

export interface IScheduleTemplateReasonV1 {
    ascend_id: string
    reason: string
    durationMinutes: number
    location: Parse.Pointer
    // INTERNAL FIELDS
    migrationStatus: string
}

const className = 'ScheduleTemplateReasonV1'
const ascendEndpoint = '/v1/scheduletemplatereasons'
const complexTypes = [
    { columnName: 'location', className: 'LocationV1', shouldIgnore: false, isRelation: false },
]

export class ScheduleTemplateReasonV1 extends ModelBase<IScheduleTemplateReasonV1> {
    
    constructor(attributes: IScheduleTemplateReasonV1) {
        super(className, attributes);
        this.ascendEndpoint = ascendEndpoint;
        this.className = className;
    }

    async connectComplexTypes() {
        await this.executeConnectComplexTypes(complexTypes, className);
    }

    async syncWithAscend() {
        const newEntries = await this.getAllFromAscend(ascendEndpoint, complexTypes, ScheduleTemplateReasonV1);
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

Parse.Object.registerSubclass(className, ScheduleTemplateReasonV1);

const schema = new Parse.Schema(className);
schema.addString('ascend_id')
schema.addString('reason')
schema.addNumber('durationMinutes')
schema.addPointer('location', 'LocationV1')
schema.addString('migrationStatus')
schema.addString('generatedBy', { required: true })
schema.addString('lastUpdatedBy', { required: true })
schema.addObject('location_ascend')

export { schema as ScheduleTemplateReasonV1Schema }