export class AgoraConfig {
    static validate() {
        if (!(
            process.env.AGORA_APP_ID &&
            process.env.AGORA_APP_CERTIFICATE
        )) {
            throw new Error(
                "Missing any of the following ENV variables: "
                + "'AGORA_APP_ID', "
                + "'AGORA_APP_CERTIFICATE'."
            );
        }
    }

    static get appId(): string {
        AgoraConfig.validate();
        return process.env.AGORA_APP_ID;
    }

    static get appCertificate(): string {
        AgoraConfig.validate();
        return process.env.AGORA_APP_CERTIFICATE;
    }
}