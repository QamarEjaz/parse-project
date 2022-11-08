import { AppVersion } from "../../../../core/src/models/AppVersion";
import { AgoraConfig } from "../../config/agoraConfig";
import { SquareConfig } from "../../config/squareConfig";

/**
 * Cloud function to retrive available slots for a range of
 * date.
 */
Parse.Cloud.define("bookingAppConfigurationsRetrieve", async (request) => {
    const versions = await new Parse.Query(AppVersion)
        .containedIn("platform", ["ios", "android"])
        .find();

    const iosBuildNumbers = versions.find((v) => v.platform === "ios")?.buildNumbers || [];
    const androidBuildNumbers = versions.find((v) => v.platform === "android")?.buildNumbers || [];

    return {
        'iosBuildNumbers': iosBuildNumbers,
        'androidBuildNumbers': androidBuildNumbers,
        'agoraAppId': AgoraConfig.appId,
        'squareApplicationId': SquareConfig.applicationId,
        'squareAppleMerchantId': SquareConfig.appleMerchantId,
    };
});