import { AscendErrorData } from "../interfaces/AscendErrorResponse";

export class AscendError extends Error {
    private _code: string;

    private _description: string;

    private _source: string;

    get code() {
        return this._code;
    }

    get description() {
        return this._description;
    }

    get source() {
        return this._source;
    }
    constructor(data: AscendErrorData) {
        super(data.title);
        this._code = data.code;
        this._description = data.description;
        this._source = data.source;

        Object.setPrototypeOf(this, AscendError.prototype);
    }
}
