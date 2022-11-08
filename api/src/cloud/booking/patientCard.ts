import { PatientV1 } from "../../../../core/src/models/PatientV1";
import { SquareCustomer } from "../../../../core/src/models/SquareCustomer";
import { SquareCard } from "../../../../core/src/models/SquareCard";
import { SquareClient } from "../../services/external/SquareClient";
import { SquareConfig } from "../../config/squareConfig";
import { ApiError, Environment } from "square";

const validCountries = [
    'ZZ', // Unknown
    'AD', // Andorra
    'AE', // United Arab Emirates
    'AF', // Afghanistan
    'AG', // Antigua and Barbuda
    'AI', // Anguilla
    'AL', // Albania
    'AM', // Armenia
    'AO', // Angola
    'AQ', // Antartica
    'AR', // Argentina
    'AS', // American Samoa
    'AT', // Austria
    'AU', // Australia
    'AW', // Aruba
    'AX', // Åland Islands
    'AZ', // Azerbaijan
    'BA', // Bosnia and Herzegovina
    'BB', // Barbados
    'BD', // Bangladesh
    'BE', // Belgium
    'BF', // Burkina Faso
    'BG', // Bulgaria
    'BH', // Bahrain
    'BI', // Burundi
    'BJ', // Benin
    'BL', // Saint Barthélemy
    'BM', // Bermuda
    'BN', // Brunei
    'BO', // Bolivia
    'BQ', // Bonaire
    'BR', // Brazil
    'BS', // Bahamas
    'BT', // Bhutan
    'BV', // Bouvet Island
    'BW', // Botswana
    'BY', // Belarus
    'BZ', // Belize
    'CA', // Canada
    'CC', // Cocos Islands
    'CD', // Democratic Republic of the Congo
    'CF', // Central African Republic
    'CG', // Congo
    'CH', // Switzerland
    'CI', // Ivory Coast
    'CK', // Cook Islands
    'CL', // Chile
    'CM', // Cameroon
    'CN', // China
    'CO', // Colombia
    'CR', // Costa Rica
    'CU', // Cuba
    'CV', // Cabo Verde
    'CW', // Curaçao
    'CX', // Christmas Island
    'CY', // Cyprus
    'CZ', // Czechia
    'DE', // Germany
    'DJ', // Djibouti
    'DK', // Denmark
    'DM', // Dominica
    'DO', // Dominican Republic
    'DZ', // Algeria
    'EC', // Ecuador
    'EE', // Estonia
    'EG', // Egypt
    'EH', // Western Sahara
    'ER', // Eritrea
    'ES', // Spain
    'ET', // Ethiopia
    'FI', // Finland
    'FJ', // Fiji
    'FK', // Falkland Islands
    'FM', // Federated States of Micronesia
    'FO', // Faroe Islands
    'FR', // France
    'GA', // Gabon
    'GB', // United Kingdom
    'GD', // Grenada
    'GE', // Georgia
    'GF', // French Guiana
    'GG', // Guernsey
    'GH', // Ghana
    'GI', // Gibraltar
    'GL', // Greenland
    'GM', // Gambia
    'GN', // Guinea
    'GP', // Guadeloupe
    'GQ', // Equatorial Guinea
    'GR', // Greece
    'GS', // South Georgia and the South Sandwich Islands
    'GT', // Guatemala
    'GU', // Guam
    'GW', // Guinea-Bissau
    'GY', // Guyana
    'HK', // Hong Kong
    'HM', // Heard Island and McDonald Islands
    'HN', // Honduras
    'HR', // Croatia
    'HT', // Haiti
    'HU', // Hungary
    'ID', // Indonesia
    'IE', // Ireland
    'IL', // Israel
    'IM', // Isle of Man
    'IN', // India
    'IO', // British Indian Ocean Territory
    'IQ', // Iraq
    'IR', // Iran
    'IS', // Iceland
    'IT', // Italy
    'JE', // Jersey
    'JM', // Jamaica
    'JO', // Jordan
    'JP', // Japan
    'KE', // Kenya
    'KG', // Kyrgyzstan
    'KH', // Cambodia
    'KI', // Kiribati
    'KM', // Comoros
    'KN', // Saint Kitts and Nevis
    'KP', // Democratic People's Republic of Korea
    'KR', // Republic of Korea
    'KW', // Kuwait
    'KY', // Cayman Islands
    'KZ', // Kazakhstan
    'LA', // Lao People's Democratic Republic
    'LB', // Lebanon
    'LC', // Saint Lucia
    'LI', // Liechtenstein
    'LK', // Sri Lanka
    'LR', // Liberia
    'LS', // Lesotho
    'LT', // Lithuania
    'LU', // Luxembourg
    'LV', // Latvia
    'LY', // Libya
    'MA', // Morocco
    'MC', // Monaco
    'MD', // Moldova
    'ME', // Montenegro
    'MF', // Saint Martin
    'MG', // Madagascar
    'MH', // Marshall Islands
    'MK', // North Macedonia
    'ML', // Mali
    'MM', // Myanmar
    'MN', // Mongolia
    'MO', // Macao
    'MP', // Northern Mariana Islands
    'MQ', // Martinique
    'MR', // Mauritania
    'MS', // Montserrat
    'MT', // Malta
    'MU', // Mauritius
    'MV', // Maldives
    'MW', // Malawi
    'MX', // Mexico
    'MY', // Malaysia
    'MZ', // Mozambique
    'NA', // Namibia
    'NC', // New Caledonia
    'NE', // Niger
    'NF', // Norfolk Island
    'NG', // Nigeria
    'NI', // Nicaragua
    'NL', // Netherlands
    'NO', // Norway
    'NP', // Nepal
    'NR', // Nauru
    'NU', // Niue
    'NZ', // New Zealand
    'OM', // Oman
    'PA', // Panama
    'PE', // Peru
    'PF', // French Polynesia
    'PG', // Papua New Guinea
    'PH', // Philippines
    'PK', // Pakistan
    'PL', // Poland
    'PM', // Saint Pierre and Miquelon
    'PN', // Pitcairn
    'PR', // Puerto Rico
    'PS', // Palestine
    'PT', // Portugal
    'PW', // Palau
    'PY', // Paraguay
    'QA', // Qatar
    'RE', // Réunion
    'RO', // Romania
    'RS', // Serbia
    'RU', // Russia
    'RW', // Rwanda
    'SA', // Saudi Arabia
    'SB', // Solomon Islands
    'SC', // Seychelles
    'SD', // Sudan
    'SE', // Sweden
    'SG', // Singapore
    'SH', // Saint Helena, Ascension and Tristan da Cunha
    'SI', // Slovenia
    'SJ', // Svalbard and Jan Mayen
    'SK', // Slovakia
    'SL', // Sierra Leone
    'SM', // San Marino
    'SN', // Senegal
    'SO', // Somalia
    'SR', // Suriname
    'SS', // South Sudan
    'ST', // Sao Tome and Principe
    'SV', // El Salvador
    'SX', // Sint Maarten
    'SY', // Syrian Arab Republic
    'SZ', // Eswatini
    'TC', // Turks and Caicos Islands
    'TD', // Chad
    'TF', // French Southern Territories
    'TG', // Togo
    'TH', // Thailand
    'TJ', // Tajikistan
    'TK', // Tokelau
    'TL', // Timor-Leste
    'TM', // Turkmenistan
    'TN', // Tunisia
    'TO', // Tonga
    'TR', // Turkey
    'TT', // Trinidad and Tobago
    'TV', // Tuvalu
    'TW', // Taiwan
    'TZ', // Tanzania
    'UA', // Ukraine
    'UG', // Uganda
    'UM', // United States Minor Outlying Islands
    'US', // United States of America
    'UY', // Uruguay
    'UZ', // Uzbekistan
    'VA', // Vatican City
    'VC', // Saint Vincent and the Grenadines
    'VE', // Venezuela
    'VG', // British Virgin Islands
    'VI', // U.S. Virgin Islands
    'VN', // Vietnam
    'VU', // Vanuatu
    'WF', // Wallis and Futuna
    'WS', // Samoa
    'YE', // Yemen
    'YT', // Mayotte
    'ZA', // South Africa
    'ZM', // Zambia
    'ZW', // Zimbabwe
];

const validateBillingAddress = (billingAddress: { [key: string]: any } | undefined) => {
    if (billingAddress) {
        if (!billingAddress.addressLine1) {
            throw new Error("`billingAddress.addressLine1` is required.");
        } else if (billingAddress.addressLine1 && typeof billingAddress.addressLine1 !== "string") {
            throw new Error("`billingAddress.addressLine1` must be a string.");
        }

        if (billingAddress.addressLine2 && typeof billingAddress.addressLine2 !== "string") {
            throw new Error("`billingAddress.addressLine2` must be a string.");
        }

        if (billingAddress.addressLine3 && typeof billingAddress.addressLine3 !== "string") {
            throw new Error("`billingAddress.addressLine3` must be a string.");
        }

        if (billingAddress.administrativeDistrictLevel1 && typeof billingAddress.administrativeDistrictLevel1 !== "string") {
            throw new Error("`billingAddress.administrativeDistrictLevel1` must be a string.");
        }

        if (!billingAddress.country) {
            throw new Error("`billingAddress.country` is required.");
        } else if (billingAddress.country && typeof billingAddress.country !== "string") {
            throw new Error("`billingAddress.country` must be a string.");
        } else if (!validCountries.includes(billingAddress.country)) {
            throw new Error("Invalid value provided for `billingAddress.country`.");
        }

        if (billingAddress.locality && typeof billingAddress.locality !== "string") {
            throw new Error("`billingAddress.locality` must be a string.");
        }

        if (!billingAddress.postalCode) {
            throw new Error("`billingAddress.postalCode` is required.");
        } else if (billingAddress.postalCode && typeof billingAddress.postalCode !== "string") {
            throw new Error("`billingAddress.postalCode` must be a string.");
        }

        if (billingAddress.sublocality && typeof billingAddress.sublocality !== "string") {
            throw new Error("`billingAddress.sublocality` must be a string.");
        }
    }
}

export const bookingPatientCardCreate = async (request: any) => {
    const patient = await new Parse.Query(PatientV1)
        .get(request.params.patientId, { useMasterKey: true })
        .catch(() => {
            throw new Parse.Error(
                Parse.Error.VALIDATION_ERROR,
                "Validation failed. The provided `patientId` is invalid."
            );
        });

    validateBillingAddress(request.params.billingAddress);

    const squareClient = new SquareClient();

    // Check if a patient has square customer.
    // If the patient doesn't have one, create new and associate
    if (
        (SquareConfig.environment === Environment.Sandbox && !patient.get("squareSandboxCustomer")) ||
        (SquareConfig.environment === Environment.Production && !patient.get("squareCustomer"))
    ) {
        const customerResponse = await squareClient.createCustomer({
            givenName: patient.get("firstName"),
            familyName: patient.get("lastName"),
            emailAddress: patient.get("emailAddress"),
        }).catch(error => {
            console.error("\n<<<<error: ", error, "\n");
            throw new Parse.Error(
                Parse.Error.VALIDATION_ERROR,
                "An error occurred while creating the customer."
            );
        });
        const customerData = customerResponse.result.customer!;

        const squareCustomer = new SquareCustomer();
        squareCustomer.id = customerData.id;
        squareCustomer.populateFromSquareData(customerData);
        squareCustomer.environment = SquareConfig.environment.toString();
        await squareCustomer.save(null, { useMasterKey: true });

        if (SquareConfig.environment === Environment.Sandbox) {
            patient.set("squareSandboxCustomer", squareCustomer);
        } else {
            patient.set("squareCustomer", squareCustomer);
        }

        await patient.save(null, { useMasterKey: true })
    }

    // Create a card and save to DB.
    const cardResponse = await squareClient.createCard({
        sourceId: request.params.nonce,
        idempotencyKey: request.params.nonce,
        card: {
            billingAddress: request.params.billingAddress,
            bin: request.params.bin,
            cardBrand: request.params.cardBrand,
            cardType: request.params.cardType,
            cardholderName: request.params.cardholderName,
            customerId: SquareConfig.environment === Environment.Sandbox
                ? patient.get("squareSandboxCustomer").id
                : patient.get("squareCustomer").id,
            enabled: request.params.enabled || true,
            expMonth: request.params.expMonth,
            expYear: request.params.expYear,
            fingerprint: request.params.fingerprint,
            last4: request.params.last4,
            merchantId: request.params.merchantId,
            prepaidType: request.params.prepaidType,
            referenceId: request.params.referenceId,
            version: request.params.version,
        }
    }).catch(error => {
        console.error("\n<<<<error: ", error, "\n");

        let message: string = "An error occurred while saving your card.";
        if (error instanceof ApiError && error.errors.length) {
            message = error.errors[0].detail
        }

        throw new Parse.Error(Parse.Error.VALIDATION_ERROR, message);
    });
    const cardData = cardResponse.result.card!;

    const squareCard = new SquareCard()
    squareCard.id = cardData.id;
    squareCard.patient = patient;
    squareCard.squareCustomer = patient.get("squareCustomer");
    squareCard.populateFromSquareData(cardData);
    squareCard.environment = SquareConfig.environment.toString();
    await squareCard.save(null, { useMasterKey: true });

    return squareCard;
}

Parse.Cloud.define("bookingPatientCardCreate", async (request) => {
    return bookingPatientCardCreate(request);
}, {
    fields: {
        patientId: {
            required: true,
            type: String,
        },
        nonce: {
            required: true,
            type: String,
        },
        billingAddress: {
            type: Object,
        },
        bin: {
            type: String,
        },
        cardBrand: {
            type: String,
            options: [
                "OTHER_BRAND",
                "VISA",
                "MASTERCARD",
                "AMERICAN_EXPRESS",
                "DISCOVER",
                "DISCOVER_DINERS",
                "JCB",
                "CHINA_UNIONPAY",
                "SQUARE_GIFT_CARD",
                "SQUARE_CAPITAL_CARD",
                "INTERAC",
                "EFTPOS",
                "FELICA",
                "EBT",
            ],
        },
        cardType: {
            type: String,
            options: [
                "UNKNOWN_CARD_TYPE",
                "CREDIT",
                "DEBIT",
            ],
        },
        cardholderName: {
            required: true,
            type: String,
        },
        enabled: {
            type: Boolean,
            default: true,
        },
        expMonth: {
            required: true,
            type: Number,
            options: (value: number) => value >= 1 && value <= 12
        },
        expYear: {
            required: true,
            type: Number,
        },
        fingerprint: {
            type: String,
        },
        last4: {
            required: true,
            type: String,
        },
        merchantId: {
            type: String,
        },
        prepaidType: {
            type: String,
            options: [
                'UNKNOWN_PREPAID_TYPE',
                'NOT_PREPAID',
                'PREPAID',
            ],
        },
        referenceId: {
            type: String,
        },
        version: {
            type: Number,
        },
    },
    validateMasterKey: true,
});

Parse.Cloud.define("bookingPatientCardList", async (request) => {
    const patient = await new Parse.Query(PatientV1)
        .get(request.params.patientId, { useMasterKey: true })
        .catch(() => {
            throw new Parse.Error(
                Parse.Error.VALIDATION_ERROR,
                "Validation failed. The provided `patientId` is invalid."
            );
        });

    const squareCards = await new Parse.Query(SquareCard)
        .equalTo("patient", patient)
        .equalTo("enabled", true)
        .equalTo("environment", SquareConfig.environment.toString())
        .find({ useMasterKey: true });

    return squareCards;
}, {
    fields: {
        patientId: {
            required: true,
            type: String,
        },
    },
    validateMasterKey: true
});

Parse.Cloud.define("bookingPatientCardDisable", async (request) => {
    const patient = await new Parse.Query(PatientV1)
        .get(request.params.patientId, { useMasterKey: true })
        .catch(() => {
            throw new Parse.Error(
                Parse.Error.VALIDATION_ERROR,
                "Validation failed. The provided `patientId` is invalid."
            );
        });

    const squareCard = await new Parse.Query(SquareCard)
        .equalTo("patient", patient)
        .get(request.params.cardId, { useMasterKey: true })
        .catch(() => {
            throw new Parse.Error(
                Parse.Error.VALIDATION_ERROR,
                "Validation failed. The provided `cardId` is invalid."
            );
        });

    const squareClient = new SquareClient();
    const cardResponse = await squareClient.disableCard(squareCard.id);
    const cardData = cardResponse.result.card;
    squareCard.populateFromSquareData(cardData);
    await squareCard.save(null, { useMasterKey: true });

    return squareCard;
}, {
    fields: {
        patientId: {
            required: true,
            type: String,
        },
        cardId: {
            required: true,
            type: String,
        },
    },
    validateMasterKey: true
});