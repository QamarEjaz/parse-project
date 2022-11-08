import { PatientV1 } from '..';
import { ModelBase } from './ModelBase';

export interface IPatientNoteV1 {
    ascend_id: string
    text: string
    noteDate: string
    patient: PatientV1
    lastModified: string
    migrationStatus: string,
    generatedBy: string,
    lastUpdatedBy: string,
}

const className = 'PatientNoteV1'
const ascendEndpoint = '/v1/patientnotes'
const complexTypes = [
    { columnName: 'patient', className: 'PatientV1', shouldIgnore: false, isRelation: false }
]

export class PatientNoteV1 extends ModelBase<IPatientNoteV1> {
    
    constructor(attributes: IPatientNoteV1) {
        super(className, attributes);
        this.ascendEndpoint = ascendEndpoint;
        this.className = className;
    }
    
    async connectComplexTypes() {
        await this.executeConnectComplexTypes(complexTypes, className);
    }
    
    async syncWithAscend() {
        const newEntries = await this.getAllFromAscend(ascendEndpoint, complexTypes, PatientNoteV1);
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

    public async deleteInAscend(object: Parse.Object, ascendClient: any) {
        try {
            const response = await ascendClient.delete(this.ascendEndpoint, object.id);
            console.log(response);
        } catch (error) {
            console.log(`\n\nERROR WHILE DELETING OBJECT IN ASCEND ...`);
            console.log(object);
        }
    }
}

Parse.Object.registerSubclass(className, PatientNoteV1);

const schema = new Parse.Schema(className);

schema.addString('ascend_id')
schema.addString('text')
schema.addString('noteDate')
schema.addString('lastModified')
schema.addString('migrationStatus')
schema.addString('generatedBy', { required: true })
schema.addString('lastUpdatedBy', { required: true })
schema.addPointer('patient', 'PatientV1')
schema.addObject('patient_ascend')

export { schema as PatientNoteV1Schema }


