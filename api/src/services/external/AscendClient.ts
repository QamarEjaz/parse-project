import axios, { AxiosRequestConfig, AxiosPromise } from "axios";
import qs from "qs";
import { AscendError } from "../../exceptions/AscendError";
import { AscendAppointmentV1, AscendAppointmentUpdateV1 } from "../../interfaces/AscendAppointmentV1";
import { AscendCollectionResponse } from "../../interfaces/AscendCollectionResponse";
import { AscendErrorResponse } from "../../interfaces/AscendErrorResponse";
import { AscendPatientUpdateV1, AscendPatientV1 } from "../../interfaces/AscendPatientV1";
import { AscendResponse } from "../../interfaces/AscendResponse";
import { AscendRetrieveCollectionParams } from "../../interfaces/AscendRetrieveCollectionParams";

export class AscendClient {

    private readonly apiBaseUrl = "https://prod.hs1api.com/ascend-gateway/api";

    private readonly clientId: string = process.env.ASCEND_CLIENT_ID;

    private readonly clientSecret: string = process.env.ASCEND_CLIENT_SECRET;

    private readonly organizationId: string = process.env.ASCEND_ORGANIZATION;

    private accessToken?: string;

    private async generateAccessToken(): Promise<string> {
        const url = "https://prod.hs1api.com/oauth/client_credential/accesstoken?grant_type=client_credentials";
        const data = qs.stringify({
            client_id: this.clientId,
            client_secret: this.clientSecret,
        });
        const headers = {
            "Organization-ID": this.organizationId,
            "Content-Type": "application/x-www-form-urlencoded"
        };
        const response = await axios.post(url, data, { headers: headers });
        const responseData = response.data;

        if (response.status !== 200) {
            throw new AscendError(response.data);
        }

        return responseData.access_token;
    }

    private async retrieveAccessToken(regenerate: boolean = false): Promise<string> {
        if (!this.accessToken || regenerate) {
            this.accessToken = await this.generateAccessToken();
        }
        return this.accessToken;
    }

    private async prepareHeaders(regenerateToken: boolean = false) {
        const accessToken = await this.retrieveAccessToken(regenerateToken);
        const headers = {
            "Organization-ID": this.organizationId,
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        };
        return headers;
    }

    private requestApi<T = any>(
        requestConfig: AxiosRequestConfig<T>
    ): AxiosPromise<T> {
        return axios(requestConfig)
            .catch(async (error) => {
                if (axios.isAxiosError(error) && error?.response && error?.response?.status === 401) {
                    requestConfig.headers = await this.prepareHeaders(true);
                    return axios(requestConfig);
                }
                console.log(error)
                throw error;
            })
            .catch((error) => {
                if (axios.isAxiosError(error) && error?.response && error?.response?.data) {
                    if(Array.isArray(error?.response?.data)) {
                        throw new Error("Unknown error was thrown.");
                    }
                    const errorData = (error?.response?.data as AscendErrorResponse)?.errors[0];
                    throw new AscendError(errorData);
                }
                console.log(error)
                throw new Error("Ascend API request failed", error);
            });
    }

    public async list<Type>(
        apiPath: string,
        params: AscendRetrieveCollectionParams = {}
    ) {
        const urlInstance = new URL(`${this.apiBaseUrl}${apiPath}`);
        urlInstance.searchParams.append("pageSize", (params.pageSize || 500).toString());
        params.filters && urlInstance.searchParams.append("filter", params.filters);
        params.lastId && urlInstance.searchParams.append("lastId", params.lastId);

        const requestConfig: AxiosRequestConfig = {
            url: urlInstance.toString(),
            method: "GET",
            headers: await this.prepareHeaders(),
        };
        const response = await this.requestApi<AscendCollectionResponse<Type>>(requestConfig);
        return response.data;
    }

    public async create<Type>(
        apiPath: string,
        data: Type
    ) {
        console.log(data);
        const requestConfig: AxiosRequestConfig = {
            url: `${this.apiBaseUrl}${apiPath}`,
            method: "POST",
            headers: await this.prepareHeaders(),
            data: JSON.stringify(data),
        };

        const response = await this.requestApi<AscendResponse<Type>>(requestConfig);
        return response.data;
    }

    public async retrieve<Type>(
        apiPath: string,
        id: string
    ) {
        const requestConfig: AxiosRequestConfig = {
            url: `${this.apiBaseUrl}${apiPath}/${id}`,
            method: "GET",
            headers: await this.prepareHeaders(),
        };
        const response = await this.requestApi<AscendResponse<Type>>(requestConfig);
        return response.data;
    }

    public async update<Type, UpdateType>(
        apiPath: string,
        id: string,
        data: UpdateType
    ) {
        const requestConfig: AxiosRequestConfig = {
            url: `${this.apiBaseUrl}${apiPath}/${id}`,
            method: "PUT",
            headers: await this.prepareHeaders(),
            data: data,
        };
        const response = await this.requestApi<AscendResponse<Type>>(requestConfig);
        return response.data;
    }

    public async delete<T>(
        apiPath: string,
        id: string
    ) {
        const requestConfig: AxiosRequestConfig = {
            url: `${this.apiBaseUrl}${apiPath}/${id}`,
            method: "DELETE",
            headers: await this.prepareHeaders(),
        };
        const response = await this.requestApi<AscendResponse<T>>(requestConfig);
        return response.data;
    }

    // ------------------------------
    // AppointmentV1 methods
    // ------------------------------

    public async listAppointmentV1(params: AscendRetrieveCollectionParams = {}) {
        return this.list<AscendAppointmentV1>("/v1/appointments", params);
    }
}