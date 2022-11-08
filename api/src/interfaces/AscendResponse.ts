import { AscendMetaData } from "./AscendMetaData";

export interface AscendResponse<T> {
    statusCode: number;
    data: T;
}