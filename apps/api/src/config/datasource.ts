import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
// This file used for typeorm migrations only
import * as dotenv from 'dotenv';
import { DatabaseType, DataSource, DataSourceOptions } from 'typeorm';
import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';
import { PluralSnakeNamingStrategy } from './lib/plural-snake-naming.strategy';

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
    database: process.env['DATABASE_TYPE'] === 'sqlite' ? process.env['DATABASE_PATH'] : process.env['DATABASE_NAME'],
    entities: [__dirname + '/../resources/**/*entity.js'],
    migrations: [__dirname + '/../migrations/**/*.js'],
    namingStrategy: new PluralSnakeNamingStrategy(),
};

export const AppDataSource = new DataSource(getDataSource(dbConfig));

function getDataSource(dbConfig: any): DataSourceOptions {
    if (dbConfig.type === 'postgres') {
        return getPostgresDataSource(dbConfig);
    } else {
        return getSqliteDataSource(dbConfig);
    }
}

function getPostgresDataSource(dbConfig: any): PostgresConnectionOptions {
    return {
        ...dbConfig,
        type: dbConfig.type as DatabaseType,
    } as PostgresConnectionOptions;
}

function getSqliteDataSource(dbConfig: any): SqliteConnectionOptions {
    return {
        ...dbConfig,
        type: dbConfig.type as DatabaseType,
    } as SqliteConnectionOptions;
}
