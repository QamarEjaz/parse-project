export class ImportTrack extends Parse.Object {
    static className = "ImportTrack";

    constructor() {
        super(ImportTrack.className);
    }

    get schemaName(): string {
        return this.get("schemaName");
    }

    set schemaName(value: string) {
        this.set("schemaName", value);
    }

    get lastImportedId(): string {
        return this.get("lastImportedId");
    }

    set lastImportedId(value: string) {
        this.set("lastImportedId", value);
    }

    get totalOnRemote(): number {
        return this.get("totalOnRemote");
    }

    set totalOnRemote(value: number) {
        this.set("totalOnRemote", value);
    }

    get lastImportedOffset(): number {
        return this.get("lastImportedOffset");
    }

    set lastImportedOffset(value: number) {
        this.set("lastImportedOffset", value);
    }

    get isCompleted(): boolean {
        return this.get("isCompleted");
    }

    set isCompleted(value: boolean) {
        this.set("isCompleted", value);
    }
}

Parse.Object.registerSubclass(
    ImportTrack.className,
    ImportTrack
);

export const ImportTrackSchema = new Parse.Schema(ImportTrack.className)
    .addString("schemaName", { required: true })
    .addString("lastImportedId")
    .addNumber("totalOnRemote", { required: true, defaultValue: 0 })
    .addNumber("lastImportedOffset", { required: true, defaultValue: 0 })
    .addBoolean("isCompleted", { required: true, defaultValue: false });