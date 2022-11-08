import * as Parse from 'parse/node';
import { ModelBase } from './ModelBase';

export interface IPerioProbe {
    ascend_id: string
    toothSide: string
    tooth: number
    toothIndex: number
    centralPocketDepth: number
    mesialPocketDepth: number
    distalPocketDepth: number
    centralGingivalMargin: number
    mesialGingivalMargin: number
    distalGingivalMargin: number
    centralBleeding: boolean
    mesialBleeding: boolean
    distalBleeding: boolean
    centralSuppuration: boolean
    mesialSuppuration: boolean
    distalSuppuration: boolean
    centralFurcationGrade: number
    mesialFurcationGrade: number
    distalFurcationGrade: number
    boneLoss: number
    mobility: number
    skipped: string
    centralCAL: number
    mesialCAL: number
    distalCAL: number
    perioExam: Parse.Pointer
    // INTERNAL FIELDS
    migrationStatus: string
}

const className = 'PerioProbe'
const ascendEndpoint = '/v0/probes'
const complexTypes = [
    { columnName: 'perioExam', className: 'PerioExam', shouldIgnore: false },
]

export class PerioProbe extends ModelBase<IPerioProbe> {
    
    constructor(attributes: IPerioProbe) {
        super(className, attributes);
        this.ascendEndpoint = ascendEndpoint;
        this.className = className;
    }
    
    async connectComplexTypes() {
        await this.executeConnectComplexTypes(complexTypes, className);
    }

    async syncWithAscend() {
        const newEntries = await this.getAllFromAscend(ascendEndpoint, complexTypes, PerioProbe);
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

Parse.Object.registerSubclass(className, PerioProbe);

const schema = new Parse.Schema(className);
schema.addString('ascend_id')
schema.addString('toothSide')
schema.addNumber('tooth')
schema.addNumber('toothIndex')
schema.addNumber('centralPocketDepth')
schema.addNumber('mesialPocketDepth')
schema.addNumber('distalPocketDepth')
schema.addNumber('centralGingivalMargin')
schema.addNumber('mesialGingivalMargin')
schema.addNumber('distalGingivalMargin')
schema.addBoolean('centralBleeding')
schema.addBoolean('mesialBleeding')
schema.addBoolean('distalBleeding')
schema.addBoolean('centralSuppuration')
schema.addBoolean('mesialSuppuration')
schema.addBoolean('distalSuppuration')
schema.addNumber('centralFurcationGrade')
schema.addNumber('mesialFurcationGrade')
schema.addNumber('distalFurcationGrade')
schema.addNumber('boneLoss')
schema.addNumber('mobility')
schema.addString('skipped')
schema.addNumber('centralCAL')
schema.addNumber('mesialCAL')
schema.addNumber('distalCAL')
schema.addPointer('perioExam', 'PerioExam')
schema.addString('migrationStatus')
schema.addString('generatedBy', { required: true })
schema.addString('lastUpdatedBy', { required: true })
schema.addObject('perioExam_ascend')

export { schema as PerioProbeSchema }