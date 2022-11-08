import { AscendMetaData } from "./AscendMetaData";

export interface AscendCollectionResponse<T> {
    statusCode: number;
    data: T[];
    meta: AscendMetaData;
}

