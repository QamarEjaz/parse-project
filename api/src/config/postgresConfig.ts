import { ClientConfig, PoolConfig } from 'pg';

export const postgresClientConfig: ClientConfig = {
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    port: parseInt(process.env.DATABASE_PORT),
}

export const postgresPoolConfig: PoolConfig = {
    user: process.env.POSTGRES_USER,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    password: process.env.POSTGRES_PASSWORD,
    port: parseInt(process.env.DATABASE_PORT),
    max: 20,
    idleTimeoutMillis: 0,
    connectionTimeoutMillis: 0,
}