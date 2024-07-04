// This file used for typeorm migrations only
import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenv.config();

export const dbConfig = {
    type: process.env['DATABASE_TYPE'],
    language: process.env['LANGUAGE'],
    host: process.env['DATABASE_HOST'],
    port: Number(process.env['DATABASE_PORT']) || 3000,
    password: process.env['DATABASE_PASSWORD'],
    name: process.env['DATABASE_NAME'],
    path: process.env['DATABASE_PATH'],
    username: process.env['DATABASE_USERNAME'],
    synchronize: process.env['DATABASE_SYNCHRONIZE'] === 'true',
    logging: process.env['DATABASE_LOGGING_ENABLED'] === 'true',
    database:
        process.env['DATABASE_TYPE'] === 'sqlite'
            ? process.env['DATABASE_PATH']
            : process.env['DATABASE_NAME'],
    entities: ['./src/resources/**/*entity.ts'],
    migrations: ['./src/migrations/**/*.ts'],
    // subscribers: ['./src/subscribers/*subscriber.ts', './src/resources/**/*subscriber.ts'],
};

export const AppDataSource = new DataSource({ type: dbConfig.type } as DataSourceOptions);
