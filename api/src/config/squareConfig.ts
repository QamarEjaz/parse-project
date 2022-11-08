import { Environment } from "square";

export class SquareConfig {
    static validate() {
        if (!(
            process.env.SQUARE_ENVIRONMENT &&
            process.env.SQUARE_SANDBOX_APPLICATION_ID &&
            process.env.SQUARE_SANDBOX_TOKEN &&
            process.env.SQUARE_SANDBOX_APPLE_MERCHANT_ID &&
            process.env.SQUARE_APPLICATION_ID &&
            process.env.SQUARE_TOKEN &&
            process.env.SQUARE_APPLE_MERCHANT_ID
        )) {
            throw new Error(
                "Missing any of the following ENV variables: "
                + "'SQUARE_ENVIRONMENT', "
                + "'SQUARE_SANDBOX_APPLICATION_ID', "
                + "'SQUARE_SANDBOX_TOKEN', "
                + "'SQUARE_SANDBOX_APPLE_MERCHANT_ID', "
                + "'SQUARE_APPLICATION_ID', "
                + "'SQUARE_TOKEN', "
                + "'SQUARE_APPLE_MERCHANT_ID'."
            );
        }
    }

    static get environment(): Environment {
        SquareConfig.validate();
        const environment = (process.env.SQUARE_ENVIRONMENT || "sandbox") == "sandbox"
            ? Environment.Sandbox
            : Environment.Production;
        return environment;
    }

    static get applicationId(): string {
        SquareConfig.validate();
        const environment = (process.env.SQUARE_ENVIRONMENT || "sandbox") == "sandbox"
            ? Environment.Sandbox
            : Environment.Production;
        return environment == Environment.Sandbox
            ? process.env.SQUARE_SANDBOX_APPLICATION_ID
            : process.env.SQUARE_APPLICATION_ID;
    }

    static get token(): string {
        SquareConfig.validate();
        const environment = (process.env.SQUARE_ENVIRONMENT || "sandbox") == "sandbox"
            ? Environment.Sandbox
            : Environment.Production;
        return environment == Environment.Sandbox
            ? process.env.SQUARE_SANDBOX_TOKEN
            : process.env.SQUARE_TOKEN;
    }

    static get appleMerchantId(): string {
        SquareConfig.validate();
        const environment = (process.env.SQUARE_ENVIRONMENT || "sandbox") == "sandbox"
            ? Environment.Sandbox
            : Environment.Production;
        return environment == Environment.Sandbox
            ? process.env.SQUARE_SANDBOX_APPLE_MERCHANT_ID
            : process.env.SQUARE_APPLE_MERCHANT_ID;
    }
}