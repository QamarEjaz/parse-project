import { ModelBase } from './ModelBase';

export interface IOperatoryV1 {
    ascend_id: string
    name: string
    shortName: string
    active: boolean
    lastModified: string
    location: Parse.Pointer
    // INTERNAL FIELDS
    migrationStatus: string
}

const ascendEndpoint = '/v1/operatories'
const complexTypes = [
    { columnName: 'location', className: 'LocationV1', shouldIgnore: false },
]

export class OperatoryV1 extends ModelBase<IOperatoryV1> {
    static className = "OperatoryV1";

    async connectComplexTypes() {
        await this.executeConnectComplexTypes(complexTypes, OperatoryV1.className);
    }

    async syncWithAscend() {
        const newEntries = await this.getAllFromAscend(ascendEndpoint, complexTypes, OperatoryV1);
        return newEntries;
    }

    constructor(attributes: IOperatoryV1) {
        super(OperatoryV1.className, attributes);
        this.ascendEndpoint = ascendEndpoint;
        this.className = OperatoryV1.className;
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

Parse.Object.registerSubclass(
    OperatoryV1.className,
    OperatoryV1
);

export const OperatoryV1Schema = new Parse.Schema(OperatoryV1.className)
    .addString('ascend_id')
    .addString('name')
    .addString('shortName')
    .addBoolean('active')
    .addString('lastModified')
    .addPointer('location', 'LocationV1')
    .addString('migrationStatus')
    .addString('generatedBy', { required: true })
    .addString('lastUpdatedBy', { required: true })
    .addObject('location_ascend');


