import { AvailableSlotService } from "../../services/AvailableSlotService";
import moment from 'moment-timezone';
import { LocationV1 } from "../../../../core/src/models/LocationV1";
import { OperatoryV1 } from "../../../../core/src/models/OperatoryV1";

/**
 * Cloud function to retrive available slots for a range of
 * date.
 */
Parse.Cloud.define("bookingSlotsRetrieveByDateRange", async (request) => {
    // return request.params;
    const location = await new Parse.Query(LocationV1)
        .get(request.params.locationId, { useMasterKey: true })
        .catch(() => {
            throw new Parse.Error(
                Parse.Error.VALIDATION_ERROR,
                "Validation failed. The provided `locationId` is invalid."
            );
        });

    const reason = request.params.reason;

    const startDateTimeLocal = moment.tz(request.params.startDateTime, location.get("timeZone"));
    if (!startDateTimeLocal.isValid()) {
        throw new Parse.Error(
            Parse.Error.VALIDATION_ERROR,
            "The provided `startDateTime` is invalid."
        );
    }

    const endDateTimeLocal = moment(request.params.endDateTime);
    if (!endDateTimeLocal.isValid()) {
        throw new Parse.Error(
            Parse.Error.VALIDATION_ERROR,
            "The provided `endDateTime` is invalid."
        );
    }

    if (startDateTimeLocal.isAfter(endDateTimeLocal)) {
        throw new Parse.Error(
            Parse.Error.VALIDATION_ERROR,
            "`startDateTime` cannot be after `endDateTime`."
        );

    }

    const slotService = new AvailableSlotService()
    const slotsByDate = await slotService.retrieveByDateTimeRange(
        location,
        reason,
        startDateTimeLocal,
        endDateTimeLocal,
        false,
        request.params.useFromAscend
    );

    const slotsByDateResponse: { [key: string]: { [key: string]: any }[] } = {};
    for (const dateString of Object.keys(slotsByDate)) {
        if (!slotsByDateResponse[dateString]) {
            slotsByDateResponse[dateString] = [];
        }
        const slotResponse = slotsByDate[dateString].map(slot => ({
            id: slot.id,
            date: dateString,
            start: slot.get("start"),
            end: slot.get("end"),
            operatory: slot.get("operatory") ? (slot.get("operatory") as unknown as OperatoryV1).toJSON() : undefined,
            providers: slot.get("providers"),

        }));
        slotsByDateResponse[dateString] = slotResponse;
    }

    return slotsByDateResponse;
}, {
    fields: {
        locationId: {
            required: true,
            type: String,
        },
        reason: {
            required: true,
            type: String,
        },
        startDateTime: {
            required: true,
            type: String,
        },
        endDateTime: {
            required: true,
            type: String,
        },
        useFromAscend: {
            type: Boolean,
        },
    },
    // `validateMasterKey` param is required while calling this
    // function with master key. Otherwise, all validations are
    // ignored.
    validateMasterKey: true,
});