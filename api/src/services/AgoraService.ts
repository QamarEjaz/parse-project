import { RtcRole, RtcTokenBuilder } from "agora-access-token";
import { AgoraConfig } from "../config/agoraConfig";

export class AgoraService {
    constructor() {
        // 
    }

    generateRTC(channelName: string, userAccount: string): string {
        const appID = AgoraConfig.appId;
        const appCertificate = AgoraConfig.appCertificate;
        const role = RtcRole.PUBLISHER;
        const expirationTimeInSeconds = 3600;
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

        const token = RtcTokenBuilder.buildTokenWithAccount(
            appID,
            appCertificate,
            channelName,
            userAccount,
            role,
            privilegeExpiredTs
        );

        return token;
    }
}