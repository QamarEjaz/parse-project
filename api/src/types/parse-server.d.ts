

declare module 'parse-server' {
  import { Express, Request } from "express";
  import { Server } from "http";
  import * as Parse from "parse/node"
  type Parse = typeof Parse

  export namespace SchemaMigrations {
    export type FieldValueType =
      | 'String'
      | 'Boolean'
      | 'File'
      | 'Number'
      | 'Relation'
      | 'Pointer'
      | 'Date'
      | 'GeoPoint'
      | 'Polygon'
      | 'Array'
      | 'Object';

    interface FieldInterface {
      type: FieldValueType;
      targetClass?: string;
      targetClassForArray?: string;
      required?: boolean;
      defaultValue?: number | string | unknown;
    }

    type ClassNameType = '_User' | '_Role' | string;

    export interface ProtectedFieldsInterface {
      [key: string]: string[];
    }

    interface FieldsInterface {
      [key: string]: FieldInterface;
    }

    export interface IndexInterface {
      [key: string]: number;
    }

    export interface IndexesInterface {
      [key: string]: IndexInterface;
    }

    export type CLPOperation = 'find' | 'count' | 'get' | 'update' | 'create' | 'delete';
    type CLPPermission =
      | 'requiresAuthentication'
      | '*'
      | /* @Typescript 4.1+ `user:${string}` | `role:${string}` */ string;
    type CLPInfo = { [key: string]: boolean };
    type CLPData = { [key: string]: CLPOperation[] };
    type CLPValue = { [key: string]: boolean };
    type CLPInterface = { [key: string]: CLPValue };

    export interface CPLsInterface {
      find?: CLPInterface;
      count?: CLPInterface;
      get?: CLPInterface;
      update?: CLPInterface;
      create?: CLPInterface;
      delete?: CLPInterface;
      addField?: CLPInterface;
      protectedFields?: ProtectedFieldsInterface;
    }

    export interface JSONSchema {
      fields: FieldsInterface;
      indexes: IndexesInterface;
      classLevelPermissions: CPLsInterface;
    }

    export interface SchemaDefinition extends JSONSchema {
      className: string,
    }

    export interface MigrationsOptions {
      schemas: JSONSchema[];
      strict: boolean;
      deleteExtraFields: boolean;
      recreateModifiedFields: boolean;
    }

    export class CLP {
      static allow(perms: CLPData): CLPInterface;
    }

    function makeSchema(
      className: ClassNameType,
      schema: Omit<JSONSchema, 'className'>
    ): SchemaDefinition;
  }


  export namespace Adapters {
    export class AnalyticsAdapter {
      /**
      @param {any} parameters: the analytics request body, analytics info will be in the dimensions property
      @param {Request} req: the original http request
       */
      appOpened(
        parameters: any,
        req: Request
      ): Promise<{}>;

      /**
      @param {String} eventName: the name of the custom eventName
      @param {any} parameters: the analytics request body, analytics info will be in the dimensions property
      @param {Request} req: the original http request
       */
      trackEvent(
        eventName: string,
        parameters: any,
        req: Request
      ): Promise<{}>;

    }

    export class CacheAdapter {
      /**
       * Get a value in the cache
       * @param {String} key Cache key to get
       * @return {Promise} that will eventually resolve to the value in the cache.
       */
      get(key: string): Promise<any>;

      /**
       * Set a value in the cache
       * @param {String} key Cache key to set
       * @param {String} value Value to set the key
       * @param {String} ttl Optional TTL
       */
      put(
        key: string,
        value: string,
        ttl: string
      ): void;

      /**
       * Remove a value from the cache.
       * @param {String} key Cache key to remove
       */
      del(key: string): void;

      /**
       * Empty a cache
       */
      clear(): void

    }

    export class MailAdapter {
      /**
       * A method for sending mail
       * @param options would have the parameters
       * - to: the recipient
       * - text: the raw text of the message
       * - subject: the subject of the email
       */
      sendMail(
        options: {
          to: string,
          text: string,
          subject: string,
        }
      ): any;
    }

    export class FilesAdapter {
      /** Responsible for storing the file in order to be retrieved later by its filename
       *
       * @param {string} filename - the filename to save
       * @param {*} data - the buffer of data from the file
       * @param {string} contentType - the supposed contentType
       * @discussion the contentType can be undefined if the controller was not able to determine it
       * @param {object} options - (Optional) options to be passed to file adapter (S3 File Adapter Only)
       * - tags: object containing key value pairs that will be stored with file
       * - metadata: object containing key value pairs that will be sotred with file (https://docs.aws.amazon.com/AmazonS3/latest/user-guide/add-object-metadata.html)
       * @discussion options are not supported by all file adapters. Check the your adapter's documentation for compatibility
       *
       * @return {Promise} a promise that should fail if the storage didn't succeed
       */
      createFile(
        filename: string,
        data: any,
        contentType: string,
        options: object
      ): Promise<any>;

      /** Responsible for deleting the specified file
       *
       * @param {string} filename - the filename to delete
       *
       * @return {Promise} a promise that should fail if the deletion didn't succeed
       */
      deleteFile(filename: string): Promise<any>;

      /** Responsible for retrieving the data of the specified file
       *
       * @param {string} filename - the name of file to retrieve
       *
       * @return {Promise} a promise that should pass with the file data or fail on error
       */
      getFileData(filename: string): Promise<any>;

      /** Returns an absolute URL where the file can be accessed
       *
       * @param {Config} config - server configuration
       * @param {string} filename
       *
       * @return {string} Absolute URL
       */
      getFileLocation(
        config: any,
        filename: string
      ): string;

      /** Validate a filename for this adapter type
       *
       * @param {string} filename
       *
       * @returns {null|Parse.Error} null if there are no errors
       */
      // validateFilename(filename: string): ?Parse.Error {}

      /** Handles Byte-Range Requests for Streaming
       *
       * @param {string} filename
       * @param {object} req
       * @param {object} res
       * @param {string} contentType
       *
       * @returns {Promise} Data for byte range
       */
      // handleFileStream(filename: string, res: any, req: any, contentType: string): Promise

      /** Responsible for retrieving metadata and tags
       *
       * @param {string} filename - the filename to retrieve metadata
       *
       * @return {Promise} a promise that should pass with metadata
       */
      // getMetadata(filename: string): Promise<any> {}
    }

    export class PubSubAdapter {
      /**
       * @returns {PubSubAdapter.Publisher}
       */
      static createPublisher(): any

      /**
       * @returns {PubSubAdapter.Subscriber}
       */
      static createSubscriber(): any
    }

    export class WSSAdapter {
      /**
       * @param {Object} options - {http.Server|https.Server} server
       */
      constructor(options: object);

      // /**
      //  * Emitted when the underlying server has been bound.
      //  */
      // onListen() {}
      // /**
      //  * Emitted when the handshake is complete.
      //  *
      //  * @param {WebSocket} ws - RFC 6455 WebSocket.
      //  */
      // onConnection(ws) {}
      // /**
      //  * Emitted when error event is called.
      //  *
      //  * @param {Error} error - WebSocketServer error
      //  */
      // onError(error) {}

      /**
       * Initialize Connection.
       *
       * @param {Object} options
       */
      start(options: object): any

      /**
       * Closes server.
       */
      close(): any
    }

    /**
     * Logger Adapter
     * Allows you to change the logger mechanism
     * Default is WinstonLoggerAdapter.js
    */
    class LoggerAdapter {
      constructor(options: any);

      /**
       * log
       * @param {String} level
       * @param {String} message
       */
      log(
        level: string,
        message: string,
      ): void;
    }
  }

  export interface Adapter<T> {
    module: string,
    options: any,
  }

  export interface CustomPagesOptions {
    /**
     * choose password page path
     */
    choosePassword: string,

    /**
     * invalid link page path
     */
    invalidLink: string,

    /**
     * invalid verification link page path
     */
    invalidVerificationLink: string,

    /**
     * verification link send fail page path
     */
    linkSendFail: string,

    /**
     * verification link send success page path
     */
    linkSendSuccess: string,

    /**
     * for masking user - facing pages
     */
    parseFrameURL: string,

    /**
     * password reset success page path
     */
    passwordResetSuccess: string,

    /**
     * verify email success page path
     */
    verifyEmailSuccess: string,
  }

  export interface IdempotencyOptions {
    /**
     * An array of paths for which the feature should be enabled. 
     * The mount path must not be included, for example instead of 
     * /parse/functions/myFunction specifiy functions/myFunction. 
     * The entries are interpreted as regular expression, for example 
     * functions/.* matches all functions, jobs/.* matches all jobs, 
     * classes/.* matches all classes, .* matches all paths.
     */
    paths: string[],

    /**
     * The duration in seconds after which a request record is 
     * discarded from the database, defaults to 300s.
     */
    ttl: number,
  }

  export interface LiveQueryOptions {
    /**
     * parse-server's LiveQuery classNames
     */
    classNames: string[],

    /**
     * LiveQuery pubsub adapter
     */
    pubSubAdapter?: Adapter<Adapters.PubSubAdapter>,

    /**
     * parse-server's LiveQuery redisOptions
     */
    redisOptions?: any,

    /**
     * parse-server's LiveQuery redisURL
     */
    redisURL?: string,

    /**
     * Adapter module for the WebSocketServer
     */
    wssAdapter?: Adapter<Adapters.WSSAdapter>,
  }

  export interface LiveQueryServerOptions {
    /**
     * This string should match the appId in use by your Parse Server. 
     * If you deploy the LiveQuery server alongside Parse Server, the 
     * LiveQuery server will try to use the same appId.
     */
    appId: string,

    /**
     * Number in milliseconds. When clients provide the sessionToken to 
     * the LiveQuery server, the LiveQuery server will try to fetch its 
     * ParseUser's objectId from parse server and store it in the cache. 
     * The value defines the duration of the cache. Check the following 
     * Security section and our protocol specification for details, 
     * defaults to 5 * 1000 ms (5 seconds).
     */
    cacheTimeout: number,

    /**
     * A JSON object that serves as a whitelist of keys. It is used for 
     * validating clients when they try to connect to the LiveQuery 
     * server. Check the following Security section and our protocol 
     * specification for details.
     */
    keyPairs: any,

    /**
     * This string defines the log level of the LiveQuery server. We 
     * support VERBOSE, INFO, ERROR, NONE, defaults to INFO.
     */
    logLevel: string,

    /**
     * This string should match the masterKey in use by your Parse Server. 
     * If you deploy the LiveQuery server alongside Parse Server, the 
     * LiveQuery server will try to use the same masterKey.
     */
    masterKey: string,

    /**
     * The port to run the LiveQuery server, defaults to 1337.
     */
    port: number,

    /**
     * LiveQuery pubsub adapter
     */
    pubSubAdapter: Adapter<Adapters.PubSubAdapter>,

    /**
     * Parse-server's LiveQuery redisOptions
     */
    redisOptions: any,

    /**
     * Parse-server's LiveQuery redisURL
     */
    redisURL: string,

    /**
     * This string should match the serverURL in use by your Parse Server. 
     * If you deploy the LiveQuery server alongside Parse Server, the 
     * LiveQuery server will try to use the same serverURL.
     */
    serverURL: string,

    /**
     * Number of milliseconds between ping/pong frames. The WebSocket server 
     * sends ping/pong frames to the clients to keep the WebSocket alive. 
     * This value defines the interval of the ping/pong frame from the 
     * server to clients, defaults to 10 * 1000 ms (10 s).
     */
    websocketTimeout: number,

    /**
     * Adapter module for the WebSocketServer
     */
    wssAdapter: Adapter<Adapters.WSSAdapter>,
  }

  export interface SchemaOptions {
    /**
     * The schema definitions. 
     * 
     * Default: []
     */
    definitions?: any[],

    /**
     * Is true if Parse Server should exit if schema update fail.
     * 
     * Default: true
     */
    strict?: boolean,

    /**
     * Is true if Parse Server should delete any fields not defined in a schema 
     * definition. This should only be used during development.
     * 
     * Default: false
     */
    deleteExtraFields?: boolean,

    /**
     * Is true if Parse Server should recreate any fields that are different 
     * between the current database schema and theschema definition. This 
     * should only be used during development.
     * 
     * Default: false
     */
    recreateModifiedFields?: boolean,

    /**
     * Is true if Parse Server will reject any attempts to modify the schema while 
     * the server is running.
     * 
     * Default: false
     */
    lockSchemas?: boolean,

    /**
     * Execute a callback before running schema migrations.
     */
    beforeMigration?: () => void,

    /**
     * Execute a callback before running schema migrations.
     */
     afterMigration?: () => void,
  }

  export interface ParseServerOptions {
    /**
     * Account lockout policy for failed login attempts
     */
    accountLockout: any,

    /**
     * Enable (or disable) client class creation, defaults to true
     */
    allowClientClassCreation?: boolean,

    /**
     * Enable (or disable) custom objectId
     */
    allowCustomObjectId?: boolean,

    /**
     * Add headers to Access-Control-Allow-Headers
     */
    allowHeaders?: string[],

    /**
     * Sets the origin to Access-Control-Allow-Origin
     */
    allowOrigin?: string,

    /**
     * Adapter module for the analytics
     */
    analyticsAdapter?: Adapter<Adapters.AnalyticsAdapter>,

    /**
     * Your Parse Application ID
     */
    appId: string,

    /**
     * Sets the app name
     */
    appName: string,

    /**
     * Configuration for your authentication providers, as stringified JSON. 
     * See http://docs.parseplatform.org/parse-server/guide/#oauth-and-3rd-party-authentication
     */
    auth: any,

    /**
     * Adapter module for the cache
     */
    cacheAdapter?: Adapter<Adapters.CacheAdapter>,

    /**
     * Sets the maximum size for the in memory cache, defaults 
     * to 10000
     */
    cacheMaxSize?: number,

    /**
     * Sets the TTL for the in memory cache (in ms), defaults to 
     * 5000 (5 seconds)
     */
    cacheTTL?: number,

    /**
     * Key for iOS, MacOS, tvOS clients
     */
    clientKey?: string,

    /**
     * Full path to your cloud code main.js
     */
    cloud: string | ((parse: Parse) => void),

    /**
     * Run with cluster, optionally set the number of processes 
     * default to os.cpus().length
     */
    cluster?: number | boolean,

    /**
     * A collection prefix for the classes
     */
    collectionPrefix?: string,

    /**
     * Custom pages for password validation and reset
     */
    customPages?: CustomPagesOptions,

    /**
     * Adapter module for the database
     */
    databaseAdapter?: any,

    /**
     * Options to pass to the mongodb client
     */
    databaseOptions: any,

    /**
     * The full URI to your database. Supported databases are mongodb 
     * or postgres.
     */
    databaseURI: string,

    /**
     * Replace HTTP Interface when using JS SDK in current node runtime, 
     * defaults to false. Caution, this is an experimental feature that 
     * may not be appropriate for production.
     */
    directAccess?: boolean,

    /**
     * Key for Unity and .Net SDK
     */
    dotNetKey?: string,

    /**
     * Adapter module for email sending
     */
    emailAdapter?: Adapter<Adapters.MailAdapter>,

    /**
     * An existing password reset token should be reused when resend 
     * verification is requested
     */
    emailVerifyTokenReuseIfValid?: boolean,

    /**
     * Email verification token validity duration, in seconds
     */
    emailVerifyTokenValidityDuration: number,

    /**
     * Enable (or disable) anonymous users, defaults to true
     */
    enableAnonymousUsers?: boolean,

    /**
     * Enables the default express error handler for all errors
     */
    enableExpressErrorHandler?: boolean,

    /**
     * Use a single schema cache shared across requests. Reduces 
     * number of queries made to _SCHEMA, defaults to false, i.e. 
     * unique schema cache per request.
     */
    enableSingleSchemaCache?: boolean,

    /**
     * Key for encrypting your files
     */
    encryptionKey?: string,

    /**
     * Sets wether we should expire the inactive sessions, defaults 
     * to true
     */
    expireInactiveSessions?: boolean,

    /**
     * Key for your files
     */
    fileKey?: string,

    /**
     * Adapter module for the files sub-system
     */
    filesAdapter: Adapter<Adapters.FilesAdapter>,

    /**
     * Mount path for the GraphQL endpoint, defaults to /graphql
     */
    graphQLPath?: string,

    /**
     * Full path to your GraphQL custom schema.graphql file
     */
    graphQLSchema?: string,

    /**
     * The host to serve ParseServer on, defaults to 0.0.0.0
     */
    host?: string,

    /**
     * Options for request idempotency to deduplicate identical 
     * requests that may be caused by network issues. Caution, this 
     * is an experimental feature that may not be appropriate for 
     * production.
     */
    idempotencyOptions?: IdempotencyOptions,

    /**
     * Key for the Javascript SDK
     */
    javascriptKey?: string,

    /**
     * Log as structured JSON objects
     */
    jsonLogs?: boolean,

    /**
     * Parse-server's LiveQuery configuration object
     */
    liveQuery: LiveQueryOptions,

    /**
     * Live query server configuration options (will start the 
     * liveQuery server)
     */
    liveQueryServerOptions?: LiveQueryServerOptions,

    /**
     * Adapter module for the logging sub-system
     */
    loggerAdapter?: Adapter<Adapters.LoggerAdapter>,

    /**
     * Sets the level for logs
     */
    logLevel: string,

    /**
     * Folder for the logs (defaults to './logs'); set to null to 
     * disable file based logging
     */
    logsFolder?: string,

    /**
     * Your Parse Master Key
     */
    masterKey: string,

    /**
     * Restrict masterKey to be used by only these ips, defaults to 
     * [] (allow all ips)
     */
    masterKeyIps?: string[],

    /**
     * Max value for limit option on queries, defaults to unlimited
     */
    maxLimit?: number,

    /**
     * Maximum number of logs to keep. If not set, no logs will be 
     * removed. This can be a number of files or number of days. If 
     * using days, add 'd' as the suffix. (default: null)
     */
    maxLogFiles?: number | string,

    /**
     * Max file size for uploads, defaults to 20mb
     */
    maxUploadSize?: string,

    /**
     * middleware for express server, can be string or function
     */
    middleware?: any,

    /**
     * Mounts the GraphQL endpoint
     */
    mountGraphQL?: boolean,

    /**
     * Mount path for the server, defaults to /parse
     */
    mountPath?: string,

    /**
     * Mounts the GraphQL Playground - never use this option in 
     * production
     */
    mountPlayground?: boolean,

    /**
     * Sets the number of characters in generated object id's, default 
     * 10
     */
    objectIdSize?: number,

    /**
     * Password policy for enforcing password related rules
     */
    passwordPolicy: any,

    /**
     * Mount path for the GraphQL Playground, defaults to /playground
     */
    playgroundPath?: string,

    /**
     * The port to run the ParseServer, defaults to 1337.
     */
    port?: number,

    /**
     * Enable (or disable) the addition of a unique hash to the file names
     */
    preserveFileName?: boolean,

    /**
     * Prevent user from login if email is not verified and 
     * PARSE_SERVER_VERIFY_USER_EMAILS is true, defaults to false
     */
    preventLoginWithUnverifiedEmail?: boolean,

    /**
     * Protected fields that should be treated with extra security when 
     * fetching details.
     */
    protectedFields?: any,

    /**
     * Public URL to your parse server with http:// or https://.
     */
    publicServerURL: string,

    /**
     * Configuration for push, as stringified JSON. See 
     * http://docs.parseplatform.org/parse-server/guide/#push-notifications
     */
    push: any,

    /**
     * Read-only key, which has the same capabilities as MasterKey without 
     * writes
     */
    readOnlyMasterKey?: boolean,

    /**
     * Key for REST calls
     */
    restAPIKey?: string,

    /**
     * When a user changes their password, either through the reset 
     * password email or while logged in, all sessions are revoked if this 
     * is true. Set to false if you don't want to revoke sessions.
     */
    revokeSessionOnPasswordReset: boolean,

    /**
     * Configuration for push scheduling, defaults to false.
     */
    scheduledPush?: boolean,

    schema?: SchemaOptions,

    /**
     * The TTL for caching the schema for optimizing read/write operations. 
     * You should put a long TTL when your DB is in production. default to 
     * 5000; set 0 to disable.
     */
    schemaCacheTTL?: number,

    /**
     * Callback when server has closed
     */
    serverCloseComplete?: () => void,

    /**
     * Callback when server has started
     */
    serverStartComplete?: () => void,

    /**
     * URL to your parse server with http:// or https://.
     */
    serverURL: string,

    /**
     * Session duration, in seconds, defaults to 1 year
     */
    sessionLength?: number,

    /**
     * Disables console output
     */
    silent?: boolean,

    /**
     * Starts the liveQuery server
     */
    startLiveQueryServer?: boolean,

    /**
     * Personally identifiable information fields in the user table the 
     * should be removed for non-authorized users. Deprecated @see 
     * protectedFields
     */
    userSensitiveFields?: string[],

    /**
     * Set the logging to verbose
     */
    verbose?: boolean,

    /**
     * Enable (or disable) user email validation, defaults to false
     */
    verifyUserEmails?: boolean,

    /**
     * Key sent with outgoing webhook calls
     */
    webhookKey?: string,
  }

  export class ParseServer {
    constructor(options: ParseServerOptions);

    get app(): any;

    handleShutdown(): Promise<void>;

    static app(options: any): any;

    promiseRouter(options: { appId: string }): any

    /**
     * Starts the parse server's express app
     * @param {ParseServerOptions} options to use to start the server
     * @param {Function} callback called when the server has started
     * @returns {ParseServer} the parse server instance
     */
    start(
      options: ParseServerOptions,
      callback?: () => void
    ): ParseServer;

    /**
     * Creates a new ParseServer and starts it.
     * @param {ParseServerOptions} options used to start the server
     * @param {Function} callback called when the server has started
     * @returns {ParseServer} the parse server instance
     */
    static start(
      options: ParseServerOptions,
      callback?: () => void
    ): ParseServer;

    /**
     * Helper method to create a liveQuery server
     * @static
     * @param {Server} httpServer an optional http server to pass
     * @param {LiveQueryServerOptions} config options for the liveQueryServer
     * @param {ParseServerOptions} options options for the ParseServer
     * @returns {ParseLiveQueryServer} the live query server instance
     */
    static createLiveQueryServer(
      httpServer?: Server,
      config?: LiveQueryServerOptions,
      options?: ParseServerOptions,
    ): any
  }

  export class ParseGraphQLServer {
    constructor(
      parseServer: ParseServer,
      config: any
    )

    applyGraphQL(app: Express): void

    applyPlayground(app: Express): void

    createSubscriptions(server: Server): void;

    setGraphQLConfig(graphQLConfig: any): any;
  }

  export default ParseServer;
}
