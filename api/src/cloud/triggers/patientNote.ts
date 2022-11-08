import { PatientNoteV1, IPatientNoteV1 } from "../../../../core/src/models/PatientNoteV1";
import { AscendClient } from "../../services/external/AscendClient";

Parse.Cloud.afterDelete("PatientNoteV1", async (request) => {
    const client = new AscendClient();
    const obj = new PatientNoteV1({} as IPatientNoteV1)

    console.log(`\n\n`);
    console.log("AfterDelete PatientNoteV1 ....");
    console.log(request.object);
    console.log(`\n\n`);

    try {        
        obj.deleteInAscend(request.object, client);
    } catch (error) {
        console.log(`\n\nERROR WHILE DELETING OBJECT IN ASCEND ...`);
        console.log(request.object);
    }
});

Parse.Cloud.afterSave("PatientNoteV1", async (request) => {
    const { object } = request;
    const config: any = await Parse.Config.get();
    const client = new AscendClient();
    const obj = new PatientNoteV1({} as IPatientNoteV1)

    try {
        if (!object.existed()) {
            obj.createInAscend(object, client);
        } else {
            await obj.updateInAscend(object, client);
        }
    } catch (error) {
        console.log(error);
    }
});
