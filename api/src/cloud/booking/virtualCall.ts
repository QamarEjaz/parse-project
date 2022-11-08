import { VirtualCall, VirtualCallPatientStatus, VirtualCallStatus } from "../../../../core/src/models/VirtualCall";
import { AppointmentV1 } from "../../../../core/src/models/AppointmentV1";
import { AgoraService } from "../../services/AgoraService";

Parse.Cloud.define("bookingVirtualCallJoin", async (request) => {
    const appointment = await new Parse.Query(AppointmentV1)
        .include("patient")
        .get(request.params.appointmentId)
        .catch(() => {
            throw new Parse.Error(
                Parse.Error.VALIDATION_ERROR,
                "Validation failed. The provided `appointmentId` is invalid."
            );
        });

    const channelName = `Appointment for ${appointment.id}`;
    const agoraToken = new AgoraService().generateRTC(channelName, request.user!.id);

    let virtualCall = await new Parse.Query(VirtualCall)
        .include("attendees")
        .equalTo("appointment", appointment)
        .first();

    if (!virtualCall) {
        virtualCall = new VirtualCall();
        virtualCall.channelName = channelName;
        virtualCall.appointment = appointment;
        virtualCall.patient = appointment.get("patient");
        virtualCall.attendees = [];
    }

    virtualCall.status = VirtualCallStatus.waiting;
    virtualCall.patientStatus = VirtualCallPatientStatus.joined;
    await virtualCall.save();

    return {
        "agoraToken": agoraToken,
        "virtualCall": virtualCall,
    }
}, {
    fields: {
        appointmentId: {
            required: true,
            type: String,
        }
    },
    validateMasterKey: true,
    requireUser: true,
});

Parse.Cloud.define("bookingVirtualCallLeave", async (request) => {
    const virtualCall = await new Parse.Query(VirtualCall)
        .include("appointment", "patient", "attendees")
        .get(request.params.virtualCallId)
        .catch(() => {
            throw new Parse.Error(
                Parse.Error.VALIDATION_ERROR,
                "Validation failed. The provided `virtualCallId` is invalid."
            );
        });

    virtualCall.patientStatus = VirtualCallPatientStatus.left;

    // If no providers are in the call, end it.
    if (!virtualCall.attendees.length) {
        virtualCall.status = VirtualCallStatus.ended;
    }

    await virtualCall.save();

    return virtualCall
}, {
    fields: {
        virtualCallId: {
            required: true,
            type: String,
        }
    },
    validateMasterKey: true,
    requireUser: true,
});