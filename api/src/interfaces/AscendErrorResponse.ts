export interface AscendErrorData {
    code: string;
    title: string;
    description: string;
    source: string;
}

export interface AscendErrorResponse {
    statusCode: number;
    errors: AscendErrorData[];
}