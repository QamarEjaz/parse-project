import * as Parse from 'parse/node';
import { ModelBase } from './ModelBase';

export interface ITooth {
    ascend_id: string
    dentalAnatomy: string
    toothType: string
    toothIndex: number
    isMixed: boolean
    universalCode: string
    fdiCode: string
    palmerCode: string
    lastModified: string
    migrationStatus: string
}

const className = 'Tooth'
const ascendEndpoint = '/v0/patientteeth/globals'
const complexTypes: any[] = []

export class Tooth extends ModelBase<ITooth> {
    constructor(attributes: ITooth) {
        super(className, attributes);
        this.ascendEndpoint = ascendEndpoint;
        this.className = className;
    }

    async connectComplexTypes() {
        await this.executeConnectComplexTypes(complexTypes, className);
    }

    async syncWithAscend() {
        const newEntries = await this.getAllFromAscend(ascendEndpoint, complexTypes, Tooth);
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

Parse.Object.registerSubclass(className, Tooth);

const schema = new Parse.Schema(className);

schema.addString('ascend_id')
schema.addString('dentalAnatomy')
schema.addString('toothType')
schema.addNumber('toothIndex')
schema.addBoolean('isMixed')
schema.addString('universalCode')
schema.addString('fdiCode')
schema.addString('palmerCode')
schema.addString('lastModified')
schema.addString('migrationStatus')
schema.addString('generatedBy', { required: true })
schema.addString('lastUpdatedBy', { required: true })

export { schema as ToothSchema }