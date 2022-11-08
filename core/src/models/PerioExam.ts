import * as Parse from 'parse/node';
import { ModelBase } from './ModelBase';

interface IVoidStatus {
    id : number
    user: Parse.Pointer
    dateVoided: string
    voidReason: string
    note: string
}

export interface IPerioExam {
    ascend_id: string
    serviceDate: string
    script: string
    finished: boolean
    toothNavigationScript: string
    lagging: number
    skipOptions: []
    voidStatus: IVoidStatus
    examCopy: Parse.Pointer
    lastEditedPerioProbe: Parse.Pointer
    created: string
    lastModified: string
    createdByUser: Parse.Pointer
    provider: Parse.Pointer
    patient: Parse.Pointer
    location: Parse.Pointer
    // INTERNAL FIELDS
    migrationStatus: string
}

const className = 'PerioExam'
const ascendEndpoint = '/v0/perioexams'
const complexTypes = [
    { columnName: 'examCopy', className: 'PerioExam', shouldIgnore: false },
    { columnName: 'lastEditedPerioProbe', className: 'PerioProbe', shouldIgnore: true },
    { columnName: 'createdByUser', className: '_User', shouldIgnore: false },
    { columnName: 'provider', className: 'ProviderV1', shouldIgnore: false },
    { columnName: 'patient', className: 'PatientV1', shouldIgnore: false },
    { columnName: 'location', className: 'LocationV1', shouldIgnore: false },
]

export class PerioExam extends ModelBase<IPerioExam> {
    
    constructor(attributes: IPerioExam) {
        super(className, attributes);
        this.ascendEndpoint = ascendEndpoint;
        this.className = className;
    }
    
    async connectComplexTypes() {
        await this.executeConnectComplexTypes(complexTypes, className);
    }

    async syncWithAscend() {
        const newEntries = await this.getAllFromAscend(ascendEndpoint, complexTypes, PerioExam);
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

Parse.Object.registerSubclass(className, PerioExam);

const schema = new Parse.Schema(className);
schema.addString('ascend_id')
schema.addString('serviceDate')
schema.addString('script')
schema.addBoolean('finished')
schema.addString('toothNavigationScript')
schema.addNumber('lagging')
schema.addArray('skipOptions')
schema.addObject('voidStatus')
schema.addString('created')
schema.addString('lastModified')
schema.addPointer('examCopy', 'PerioExam')
schema.addPointer('lastEditedPerioProbe', 'PerioProbe')
schema.addPointer('createdByUser', '_User')
schema.addPointer('provider', 'ProviderV1')
schema.addPointer('patient', 'PatientV1')
schema.addPointer('location', 'LocationV1')
schema.addString('migrationStatus')
schema.addString('generatedBy', { required: true })
schema.addString('lastUpdatedBy', { required: true })
schema.addObject('examCopy_ascend')
schema.addObject('lastEditedPerioProbe_ascend')
schema.addObject('createdByUser_ascend')
schema.addObject('provider_ascend')
schema.addObject('patient_ascend')
schema.addObject('location_ascend')

export { schema as PerioExamSchema }