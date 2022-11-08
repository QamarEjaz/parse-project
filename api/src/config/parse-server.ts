const { default: ParseServer, ParseGraphQLServer } = require('parse-server');
var GCSAdapter = require('parse-server').GCSAdapter;
var S3Adapter = require('@parse/s3-files-adapter');
import fs from 'fs';
import { LiveQueryOptions, ParseServerOptions } from 'parse-server';
import { PhoneAuthAdapter } from '../adapters/auth/phoneAuth';

interface ACCOUNT_LOCKOUT_POLICY {
    duration: number;
    threshold: number;
    unlockOnPasswordReset: boolean;
}
interface PASSWORD_POLICY {
    validatorPattern: RegExp;
    doNotAllowUsername: boolean;
    maxPasswordHistory: number;
    maxPasswordAge: number;
    validationError: string;
}
interface PushConfig {
    [key: string]: any;
}

interface EmailAdapter {
    module: string | undefined,
    options: EmailAdapterOptions
}

interface EmailAdapterOptions {
    fromAddress?: string,
    fromName?: string,
    fromEmail?: string,
    domain?: string,
    apiKey?: string,
    apiSecret?: string,
    multiTemplate?: any,
    confirmTemplatePath?: any,
    passwordTemplatePath?: any,
    confirmOptions?: any,
    passwordOptions?: any,
    amazon?: string,
    port?: number,
    host?: string,
    user?: string,
    password?: string,
    translation?: {
        default: string
        locale: string
    },
    sender?: string,
    templates?: {
        passwordResetEmail: {
            subjectPath: string;
            textPath: string;
            htmlPath: string;
        };
        userSignupInternalNotificationEmail: {
            subjectPath: string;
            textPath: string;
            htmlPath: string;
        };
    },
    apiCallback?: ({ payload, locale }: any) => Promise<void>,
    passwordResetSubject?: Language | string,
    passwordResetTextPart?: Language,
    passwordResetHtmlPart?: Language,
    verificationEmailSubject?: Language,
    verificationEmailTextPart?: Language,
    verificationEmailHtmlPart?: Language,
    verificationSubject?: string,
    verificationBody?: string,
    verificationBodyHTML?: string,
    passwordResetBody?: string
    passwordResetBodyHTML?: string,
}
interface Language {
    en: string,
    fr: string
}
export interface parseServerConfigurationOptions {
    databaseURI: string;
    databaseOptions: object;
    cloud: string;
    appId: string;
    masterKey: string;
    serverURL: string;
    collectionPrefix: string | undefined;
    clientKey: string | undefined;
    restAPIKey: string | undefined;
    javascriptKey: string | undefined;
    dotNetKey: string | undefined;
    fileKey: string | undefined;
    filesAdapter: any;
    auth: object;
    maxUploadSize: string | undefined;
    push: PushConfig;
    verifyUserEmails: boolean;
    preventLoginWithUnverifiedEmail: boolean;
    emailAdapter: EmailAdapter;
    enableAnonymousUsers: boolean;
    allowClientClassCreation: boolean;
    appName: string | undefined;
    liveQuery: string | object | undefined;
    logLevel: string;
    accountLockout: ACCOUNT_LOCKOUT_POLICY;
    passwordPolicy: PASSWORD_POLICY;
    sessionLength: number;
    revokeSessionOnPasswordReset: boolean;
    expireInactiveSessions: boolean;
    publicServerURL?: string
}


// The account lock policy
const ACCOUNT_LOCKOUT_POLICY: parseServerConfigurationOptions['accountLockout'] = {
    // Lock the account for 5 minutes.
    duration: parseInt(process.env.ACCOUNT_LOCKOUT_POLICY_DURATION!) || 5,
    // Lock an account after 3 failed log-in attempts
    threshold: parseInt(process.env.ACCOUNT_LOCKOUT_POLICY_THRESHOLD!) || 3,
    // Unlock the account after a successful password reset
    unlockOnPasswordReset: Boolean(process.env.ACCOUNT_LOCKOUT_POLICY_UNLOCK_ON_PASSWORD_RESET) || true,
};

console.log("ACCOUNT_LOCKOUT_POLICY: ", ACCOUNT_LOCKOUT_POLICY);

// The password policy
const PASSWORD_POLICY: parseServerConfigurationOptions['passwordPolicy'] = {
    // Enforce a password of at least 8 characters which contain at least 1 lower case, 1 upper case and 1 digit
    validatorPattern: /^(?=.{4,})/,
    // Do not allow the username as part of the password
    doNotAllowUsername: Boolean(process.env.PASSWORD_POLICY_DO_NOT_ALLOW_USERNAME) || true,
    // Set the number of previous password that will not be allowed to be set as new password. If the option is not set or set to `0`, no previous passwords will be considered.<br><br>Valid values are >= `0` and <= `20`.<br>Default is `0`.
    maxPasswordHistory: parseInt(process.env.PASSWORD_POLICY_MAX_PASSWORD_HISTORY!) || 10,
    // Set the number of days after which a password expires. Login attempts fail if the user does not reset the password before expiration.
    maxPasswordAge: parseInt(process.env.PASSWORD_POLICY_MAX_PASSWORD_AGE!) || 15,
    // Set the error message to be sent.<br><br>Default is `Password does not meet the Password Policy requirements.`
    validationError: process.env.PASSWORD_POLICY_VALIDATION_ERROR || "Password does not meet the Password Policy requirements. Password must contain English uppercase characters (A through Z) English lowercase characters (a through z) Numerals (0 through 9). Must contain at least 8 characters. Must not have been used in the previous 10 passwords. Must not contain a user's Account or full name. Must contain non-alphabetic characters (e.g.,: !, $, #, %)"
};

console.log("PASSWORD_POLICY: ", PASSWORD_POLICY);

var databaseType = process.env.DATABASE_TYPE || 'mongo';
var databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI;

if (databaseType === 'postgres') {
    var POSTGRES_USER = process.env.POSTGRES_USER || 'postgres';
    var POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD || 'postgres';
    var DATABASE_PORT = process.env.POSTGRES_PORT || 5432;
    var DATABASE_HOST = process.env.DATABASE_HOST || "dr-h-co-postgres",
        DATABASE_NAME = process.env.DATABASE_NAME || "parse_server_db"
    databaseUri = `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}`;

    console.log("DATABASE URI = ", databaseUri);

} else if (databaseType === 'mongo' && !databaseUri) {
    var DATABASE_HOST = process.env.DATABASE_HOST || "dr-h-co-mongo";
    databaseUri = `mongodb://${DATABASE_HOST}:27017/dev`;
}

let facebookAppIds: string | string[] = process.env.FACEBOOK_APP_IDS;
if (facebookAppIds) {
    facebookAppIds = facebookAppIds.split(",");
}

var gcmId = process.env.GCM_ID || '';
var gcmKey = process.env.GCM_KEY || '';

var iosPushConfigs = new Array();
var isFile = function (f: any): boolean {
    var b = false;
    try {
        b = fs.statSync(f).isFile();
    } catch (e) {
    }
    return b;
}

var productionBundleId = process.env.PRODUCTION_BUNDLE_ID!;
var productionPfx = process.env.PRODUCTION_PFX || '/certs/production-pfx.p12' || null;
productionPfx = isFile(productionPfx) ? productionPfx : null;
var productionCert = process.env.PRODUCTION_CERT || '/certs/production-pfx-cert.pem' || null;
productionCert = isFile(productionCert) ? productionCert : null;
var productionKey = process.env.PRODUCTION_KEY || '/certs/production-pfx-key.pem' || null;
productionKey = isFile(productionKey) ? productionKey : null;
var productionPassphrase = process.env.PRODUCTION_PASSPHRASE || null;
var productionPushConfig;
if (productionBundleId && (productionPfx || (productionCert && productionKey))) {
    productionPushConfig = {
        pfx: productionPfx,
        cert: productionCert,
        key: productionKey,
        passphrase: productionPassphrase,
        bundleId: productionBundleId,
        production: true
    };
    iosPushConfigs.push(productionPushConfig);
}

var devBundleId = process.env.DEV_BUNDLE_ID;
var devPfx = process.env.DEV_PFX || '/certs/dev-pfx.p12';
devPfx = isFile(devPfx) ? devPfx : null!;
var devCert = process.env.DEV_CERT || '/certs/dev-pfx-cert.pem';
devCert = isFile(devCert) ? devCert : null!;
var devKey = process.env.DEV_KEY || '/certs/dev-pfx-key.pem';
devKey = isFile(devKey) ? devKey : null!;
var devPassphrase = process.env.DEV_PASSPHRASE || null;
var devPushConfig;

if (devBundleId && (devPfx || (devCert && devKey))) { // exsiting files if not null
    devPushConfig = {
        pfx: devPfx,
        cert: devCert,
        key: devKey,
        passphrase: devPassphrase,
        bundleId: devBundleId,
        production: false
    };
    iosPushConfigs.push(devPushConfig);
}

if (process.env.APNS_BUNDLES_ID && process.env.APNS_BUNDLES_P12 && process.env.APNS_BUNDLES_PROD) {
    var APNSBundlesId = process.env.APNS_BUNDLES_ID.split(',').map(function (entry) {
        return entry.trim();
    });
    var APNSBundlesP12 = process.env.APNS_BUNDLES_P12.split(',').map(function (entry) {
        return entry.trim();
    });
    var APNSBundlesProd = process.env.APNS_BUNDLES_PROD.split(',').map(function (entry) {
        return entry.trim();
    });
    if (APNSBundlesId.length === APNSBundlesP12.length && APNSBundlesP12.length === APNSBundlesProd.length) {
        for (var i = 0; i < APNSBundlesId.length; i++) {
            let APNSpushConfig: object = {
                pfx: APNSBundlesP12[i],
                bundleId: APNSBundlesId[i],
                production: (APNSBundlesProd[i] === 'true' ? true : false)
            };
            iosPushConfigs.push(APNSpushConfig);
        }
    }
}



var pushConfig: any = {};
if (gcmId && gcmKey) {
    pushConfig.android = {
        senderId: gcmId,
        apiKey: gcmKey
    }
}
if (iosPushConfigs.length > 0) {
    pushConfig.ios = iosPushConfigs;
    //console.log('Multiple iOS push configurations.')
}

console.log('pushConfig : ', pushConfig);

var port = process.env.PORT || 1337;

var mountPath = process.env.PARSE_MOUNT || '/parse';
var serverURL = process.env.SERVER_URL || 'http://localhost:' + port + mountPath; // Don't forget to change to https if needed

var filesAdapter: parseServerConfigurationOptions['filesAdapter'];

if (process.env.S3_ACCESS_KEY &&
    process.env.S3_SECRET_KEY &&
    process.env.S3_BUCKET) {
    var directAccess = !!+(process.env.S3_DIRECT!);

    filesAdapter = new S3Adapter(
        process.env.S3_ACCESS_KEY,
        process.env.S3_SECRET_KEY,
        process.env.S3_BUCKET,
        { directAccess: directAccess });
} else if (process.env.GCP_PROJECT_ID &&
    process.env.GCP_KEYFILE_PATH &&
    process.env.GCS_BUCKET) {
    var directAccess = !!+(process.env.GCS_DIRECT!);

    filesAdapter = new GCSAdapter(
        process.env.GCP_PROJECT_ID,
        process.env.GCP_KEYFILE_PATH,
        process.env.GCS_BUCKET,
        { directAccess: directAccess });
}
console.log("FILES ADAPTER : ", filesAdapter);
const emailApiKey = process.env.EMAIL_API_KEY;

var verifyUserEmails = (process.env.VERIFY_USER_EMAILS === "true");
var enableAnonymousUsers = (process.env.ENABLE_ANON_USERS === "true");
var allowClientClassCreation = (process.env.ALLOW_CLIENT_CLASS_CREATION === "true");
var preventLoginWithUnverifiedEmail = (process.env.PREVENT_LOGIN_WITH_UNVERIFIED_EMAIL === "true");


let emailAdapter: EmailAdapter = { module: '', options: {} };
var emailModule = process.env.EMAIL_MODULE;

if (!!emailModule) {
    if (emailModule === "parse-smtp-template") {
        emailAdapter = {
            module: 'parse-smtp-template',
            options: {
                port: Number(process.env.EMAIL_SMTP_PORT),
                host: process.env.EMAIL_HOST,
                user: process.env.EMAIL_USER,
                password: process.env.EMAIL_SMTP_PASSWORD,
                fromAddress: process.env.EMAIL_FROM,
                multiTemplate: true,
                confirmTemplatePath: "./public/email_verification.html",
                confirmOptions: {
                    subject: "confirm your email",
                    body: "Custom email confirmation body",
                    btn: "confirm your email"
                },
                passwordTemplatePath: "./public/reset_password.html",
                passwordOptions: {
                    subject: "Reset My Password",
                    body: "name",
                    btn: "Reset My Password"
                }
            }
        }
    } else {
        var emailAdapterOptions: EmailAdapterOptions = {
            fromAddress: process.env.EMAIL_FROM_EMAIL,
            fromName: process.env.EMAIL_FROM_NAME,
            domain: process.env.EMAIL_DOMAIN,
            apiKey: emailApiKey
        };
        if (process.env.EMAIL_VERIFICATION_SUBJECT) {
            emailAdapterOptions.verificationSubject = process.env.EMAIL_VERIFICATION_SUBJECT;
        }
        if (process.env.EMAIL_VERIFICATION_BODY) {
            emailAdapterOptions.verificationBody = process.env.EMAIL_VERIFICATION_BODY;
        }
        if (process.env.EMAIL_VERIFICATION_BODY_HTML) {
            emailAdapterOptions.verificationBodyHTML = fs.readFileSync(process.env.EMAIL_VERIFICATION_BODY_HTML, "utf8") || process.env.EMAIL_VERIFICATION_BODY_HTML;
        }
        if (process.env.EMAIL_PASSWORD_RESET_SUBJECT) {
            emailAdapterOptions.passwordResetSubject = process.env.EMAIL_PASSWORD_RESET_SUBJECT;
        }
        if (process.env.EMAIL_PASSWORD_RESET_BODY) {
            emailAdapterOptions.passwordResetBody = process.env.EMAIL_PASSWORD_RESET_BODY;
        }
        if (process.env.EMAIL_PASSWORD_RESET_BODY_HTML) {
            emailAdapterOptions.passwordResetBodyHTML = fs.readFileSync(process.env.EMAIL_PASSWORD_RESET_BODY_HTML, "utf8") || process.env.EMAIL_PASSWORD_RESET_BODY_HTML;
        }
        emailAdapter = {
            module: emailModule,
            options: emailAdapterOptions
        };
    }
    console.log("emailAdapter : ", emailAdapter);
}

var liveQuery: parseServerConfigurationOptions['liveQuery'] = process.env.LIVEQUERY_SUPPORT!
console.log("LIVEQUERY_SUPPORT: " + liveQuery);
const liveQueryParam: LiveQueryOptions = {
    classNames: []
};
if (liveQuery) {
    const liveQueryClasses = process.env.LIVEQUERY_CLASSES!.split(',').map(function (entry) {
        return entry.trim();
    });
    console.log("LIVEQUERY_CLASSES: " + liveQueryClasses);

    liveQueryParam.classNames = liveQueryClasses;
}

var databaseOptions: parseServerConfigurationOptions['databaseOptions'] = {};

if (process.env.DATABASE_TIMEOUT) {
    databaseOptions = {
        socketTimeoutMS: +(process.env.DATABASE_TIMEOUT)
    };
}

var auth: { [key: string]: any } = {};
for (var env in process.env) {
    if (!process.env.hasOwnProperty(env)) {
        break;
    }

    var env_parameters: string[] = /^AUTH_([^_]*)_(.+)/.exec(env)!;

    if (env_parameters !== null) {
        if (typeof auth[env_parameters[1].toLowerCase()] === "undefined") {
            auth[env_parameters[1].toLowerCase()] = {};
        }

        auth[env_parameters[1].toLowerCase()][env_parameters[2].toLowerCase()] = process.env[env];
    }
}

let parseServerConfiguration: ParseServerOptions = {
    databaseURI: databaseUri as string,
    databaseOptions: databaseOptions,
    allowCustomObjectId: true,
    cloud: (parse) => {
        // @ts-ignore: allowCustomObjectId is valid but does not exist
        // in @types/parse. 
        parse.allowCustomObjectId = true;

        const cloudMain = require('../cloud/main');
        cloudMain.cloudInit();
    },
    appId: process.env.APP_ID || 'APP_ID',
    masterKey: process.env.MASTER_KEY || 'MASTER_KEY',
    serverURL: serverURL || 'http://localhost:1337/parse',
    collectionPrefix: process.env.COLLECTION_PREFIX,
    clientKey: process.env.CLIENT_KEY,
    restAPIKey: process.env.REST_API_KEY,
    javascriptKey: process.env.JAVASCRIPT_KEY,
    dotNetKey: process.env.DOTNET_KEY,
    fileKey: process.env.FILE_KEY,
    filesAdapter: filesAdapter,
    auth: (() => {
        const auth: { [key: string]: any } = {}

        // Add phoneAuth
        auth.phoneAuth = {
            module: new PhoneAuthAdapter,
        };

        // Add facebook auth if configured
        if (facebookAppIds && facebookAppIds.length) {
            auth.facebook = {
                appIds: facebookAppIds
            };
        }

        return auth;
    })(),
    maxUploadSize: process.env.MAX_UPLOAD_SIZE,
    push: pushConfig,
    // TODO: uncomment
    // verifyUserEmails: verifyUserEmails,
    preventLoginWithUnverifiedEmail: preventLoginWithUnverifiedEmail,
    enableAnonymousUsers: enableAnonymousUsers,
    allowClientClassCreation: allowClientClassCreation,
    appName: process.env.APP_NAME || 'DR-H-CO',
    liveQuery: liveQueryParam,
    logLevel: process.env.LOG_LEVEL || 'info',
    accountLockout: ACCOUNT_LOCKOUT_POLICY,
    passwordPolicy: PASSWORD_POLICY,
    sessionLength: parseInt(process.env.SESSION_LENGTH!) || 300000000,
    revokeSessionOnPasswordReset: Boolean(process.env.REVOKE_SESSION_ON_PASSWORD_RESET) || true,
    expireInactiveSessions: Boolean(process.env.EXPIRE_INACTIVE_SESSION) || true,
    publicServerURL: process.env.PUBLIC_SERVER_URL,
    // Set email verification token validity to 2 hours
    emailVerifyTokenValidityDuration: 2 * 60 * 60,
};

if (!!emailModule) {
    // TODO: uncomment
    // parseServerConfiguration['emailAdapter'] = emailAdapter;
}

console.log(parseServerConfiguration);

// this will ensure that public server url is set when deploying to testing staging and prod
if (!!process.env.PUBLIC_SERVER_URL) {
    parseServerConfiguration.publicServerURL = process.env.PUBLIC_SERVER_URL;
}

export { parseServerConfiguration };
