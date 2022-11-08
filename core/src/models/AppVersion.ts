export class AppVersion extends Parse.Object {
    static className = 'AppVersion';

    static fromJSON(json: any, override?: boolean | undefined): AppVersion {
        const object = super.fromJSON(
            {
                className: AppVersion.className,
                ...json,
            },
            override
        ) as unknown as AppVersion;
        return object;
    }

    constructor() {
        super(AppVersion.className);
    }

    get createdAt(): Date {
        return this.get("createdAt");
    }

    set createdAt(value: Date) {
        this.set("createdAt", value);
    }

    get updatedAt(): Date {
        return this.get("updatedAt");
    }

    set updatedAt(value: Date) {
        this.set("updatedAt", value);
    }

    get platform(): string {
        return this.get("platform");
    }

    set platform(value: string) {
        this.set("platform", value);
    }

    get buildNumbers(): string[] {
        return this.get("buildNumbers");
    }

    set buildNumbers(value: string[]) {
        this.set("buildNumbers", value);
    }
}

// Register class
Parse.Object.registerSubclass(
    AppVersion.className,
    AppVersion
);

// Schema definition
export const AppVersionSchema = new Parse.Schema(AppVersion.className)
    .addString("platform", { required: true })
    .addArray("buildNumbers", { required: true });