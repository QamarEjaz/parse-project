import { Client } from 'pg';

const config = {
    user: process.env.POSTGRES_USER,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    password: process.env.POSTGRES_PASSWORD,
    port: parseInt(process.env.DATABASE_PORT as any),
}

const pgClient = new Client(config);
export {pgClient};