import * as Parse from 'parse/node';
import { ModelBase } from './ModelBase';

export interface IScheduleTemplateV1 {
    ascend_id: string
    title: string
    color: number
    start: string
    end: string
    bookOnline: boolean
    dayOfWeek: string
    bookingTypes: []
    location: Parse.Pointer
    operatory: Parse.Pointer
    providers: Parse.Relation
    reasons: Parse.Relation
    // INTERNAL FIELDS
    migrationStatus: string
}

const className = 'ScheduleTemplateV1'
const ascendEndpoint = '/v1/scheduletemplates'
const complexTypes = [
    { columnName: 'location', className: 'LocationV1', shouldIgnore: false, isRelation: false },
    { columnName: 'operatory', className: 'OperatoryV1', shouldIgnore: false, isRelation: false },
    { columnName: 'providers', className: 'ProviderV1', shouldIgnore: false, isRelation: true },
    { columnName: 'reasons', className: 'ScheduleTemplateReasonV1', shouldIgnore: false, isRelation: true }
]

export class ScheduleTemplateV1 extends ModelBase<IScheduleTemplateV1> {
    
    constructor(attributes: IScheduleTemplateV1) {
        super(className, attributes);
        this.ascendEndpoint = ascendEndpoint;
        this.className = className;
    }
    
    async connectComplexTypes() {
        await this.executeConnectComplexTypes(complexTypes, className);
    }

    async syncWithAscend() {
        const newEntries = await this.getAllFromAscend(ascendEndpoint, complexTypes, ScheduleTemplateV1);
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

Parse.Object.registerSubclass(className, ScheduleTemplateV1);

const schema = new Parse.Schema(className);
schema.addString('ascend_id')
schema.addString('title')
schema.addString('color')
schema.addString('start')
schema.addString('end')
schema.addBoolean('bookOnline')
schema.addString('dayOfWeek')
schema.addPointer('location', 'LocationV1')
schema.addArray('bookingTypes')
schema.addPointer('operatory','OperatoryV1')
schema.addRelation('providers','ProviderV1');
schema.addRelation('reasons', 'ScheduleTemplateReasonV1');
schema.addString('migrationStatus')
schema.addString('generatedBy', { required: true })
schema.addString('lastUpdatedBy', { required: true })
schema.addObject('location_ascend')
schema.addObject('operatory_ascend')
schema.addArray('providers_ascend')
schema.addArray('reasons_ascend')

export { schema as ScheduleTemplateV1Schema }