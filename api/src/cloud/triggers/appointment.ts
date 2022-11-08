import { AppointmentV1, IAppointmentV1 } from "../../../../core/src/models/AppointmentV1";
import { AscendClient } from "../../services/external/AscendClient";
import {checkAutomations} from "../checkAutomation";

Parse.Cloud.afterDelete("AppointmentV1", async (request) => {
    const client = new AscendClient();
    const obj = new AppointmentV1({} as IAppointmentV1)

    console.log(`\n\n`);
    console.log("TODO : AfterDelete AppointmentV1 ....");
    console.log(request.object);
    console.log(`\n\n`);

    try {        
        obj.deleteInAscend(request.object, client);
    } catch (error) {
        console.log(`\n\nERROR WHILE DELETING OBJECT IN ASCEND ...`);
        console.log(request.object);
    }
});

Parse.Cloud.afterSave("AppointmentV1", async (request) => {
    const { object } = request;
    const config: any = await Parse.Config.get();
    const client = new AscendClient();
    const obj = new AppointmentV1({} as IAppointmentV1)

    try {
        if (!object.existed()) {
            obj.createInAscend(object, client);
        } else {
            await obj.updateInAscend(object, client);
        }
    
        if (object.get('status') === 'COMPLETE') {
            const patient = object.get('patient');
            patient.set('hasCompletedAppointment', true);
            const patientAppointmentsRelation = patient.get('appointments');
            patientAppointmentsRelation.add(object);
            await patient.save();
        }
    } catch (error) {
        console.log(error);
    }

    checkAutomations('AppointmentV1',object);

});
