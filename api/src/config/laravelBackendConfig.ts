import * as mysql from "mysql2/promise";

export class LaravelBackendConfig {
    static getDatabaseConfig() {
        if (!(
            process.env.LARAVEL_BACKEND_DATABASE_HOST &&
            process.env.LARAVEL_BACKEND_DATABASE_USER &&
            process.env.LARAVEL_BACKEND_DATABASE_PASSWORD &&
            process.env.LARAVEL_BACKEND_DATABASE_NAME
        )) {
            throw new Error(
                "You are missing one of the following required ENV variable: " +
                [
                    "LARAVEL_BACKEND_DATABASE_HOST",
                    "LARAVEL_BACKEND_DATABASE_USER",
                    "LARAVEL_BACKEND_DATABASE_PASSWORD",
                    "LARAVEL_BACKEND_DATABASE_NAME"
                ].join(", ")
            );
        }

        const databaseConfig: mysql.PoolOptions = {
            connectionLimit: 10,
            host: process.env.LARAVEL_BACKEND_DATABASE_HOST,
            user: process.env.LARAVEL_BACKEND_DATABASE_USER,
            password: process.env.LARAVEL_BACKEND_DATABASE_PASSWORD,
            database: process.env.LARAVEL_BACKEND_DATABASE_NAME,
        }

        return databaseConfig;
    }
}