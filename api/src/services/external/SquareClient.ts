import { Client, CreateCustomerRequest, CreateCardRequest } from "square";
import { SquareConfig } from "../../config/squareConfig";

export class SquareClient {
    private client: Client;

    constructor() {
        this.client = new Client({
            accessToken: SquareConfig.token,
            environment: SquareConfig.environment,
            squareVersion: "2021-06-16",
        });
    }

    createCustomer(data: CreateCustomerRequest) {
        return this.client.customersApi.createCustomer(data);
    }

    createCard(data: CreateCardRequest) {
        return this.client.cardsApi.createCard(data);
    }

    disableCard(cardId: string) {
        return this.client.cardsApi.disableCard(cardId);
    }
}