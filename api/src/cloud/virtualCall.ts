import { AppointmentV1 } from '../../../core/src';
import { VirtualCallStatus, VirtualCall, VirtualCallPatientStatus } from '../../../core/src/models/VirtualCall';
import { AgoraService } from '../services/AgoraService';

Parse.Cloud.define("crmVirtualCallCreate", async (request) => {
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
        virtualCall.status = VirtualCallStatus.waiting;
        virtualCall.patientStatus = VirtualCallPatientStatus.waiting;
        await virtualCall.save();
    }

    return virtualCall;
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

Parse.Cloud.define("crmVirtualCallJoin", async (request) => {
    let virtualCall = await new Parse.Query(VirtualCall)
        .include("appointment", "patient", "attendees")
        .get(request.params.virtualCallId, { useMasterKey: true })
        .catch(() => {
            throw new Parse.Error(
                Parse.Error.VALIDATION_ERROR,
                "Validation failed. The provided `virtualCallId` is invalid."
            );
        });

    const appointmentId = virtualCall.appointment instanceof AppointmentV1
        ? virtualCall.appointment.id
        : virtualCall.appointment.objectId;
    const channelName = `Appointment for ${appointmentId}`;
    const agoraToken = new AgoraService().generateRTC(channelName, request.user!.id);

    if (!virtualCall.attendees.find((i) => i.id === request.user!.id)) {
        const attendees = virtualCall.attendees;
        attendees.push(request.user!);
        virtualCall.attendees = attendees;
    }

    virtualCall.status = VirtualCallStatus.active;
    await virtualCall.save();

    return {
        "agoraToken": agoraToken,
        "virtualCall": virtualCall,
    }
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

Parse.Cloud.define("crmVirtualCallKickPatient", async (request) => {
    const virtualCall = await new Parse.Query(VirtualCall)
        .include("appointment", "patient", "attendees")
        .get(request.params.virtualCallId)
        .catch(() => {
            throw new Parse.Error(
                Parse.Error.VALIDATION_ERROR,
                "Validation failed. The provided `virtualCallId` is invalid."
            );
        });

    virtualCall.patientStatus = VirtualCallPatientStatus.kicked;
    virtualCall.status = VirtualCallStatus.ended;

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

Parse.Cloud.define("crmVirtualCallLeave", async (request) => {
    const virtualCall = await new Parse.Query(VirtualCall)
        .include("appointment", "patient", "attendees")
        .get(request.params.virtualCallId)
        .catch(() => {
            throw new Parse.Error(
                Parse.Error.VALIDATION_ERROR,
                "Validation failed. The provided `virtualCallId` is invalid."
            );
        });
        
    if (virtualCall.attendees.find((i) => i.id === request.user!.id)) {
        virtualCall.attendees = virtualCall.attendees.filter((i) => i.id !== request.user!.id);
    }

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
