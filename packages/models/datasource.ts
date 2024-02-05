import { DataSource } from 'typeorm';

export const dbConfig = {
    type: process.env['DATABASE_TYPE'],
    host: process.env['DATABASE_HOST'],
    port: +process.env['DATABASE_PORT'],
    password: process.env['DATABASE_PASSWORD'],
    name: process.env['DATABASE_NAME'],
    path: process.env['DATABASE_PATH'],
    username: process.env['DATABASE_USERNAME'],
    synchronize: process.env['DATABASE_SYNCHRONIZE'] === 'true',
    logging: process.env['DATABASE_LOGGING_ENABLED'] === 'true',
    database: process.env['DATABASE_SQLITE'],
    entities: ['./src/**/*entity.ts'],
    migrations: ['./migrations/**/*.ts'],
    subscribers: ['./src/**/*subscriber.ts'],
};

// eslint-disable-next-line no-console
// console.log(`Data source on port ${dbConfig.port}.`);
// eslint-disable-next-line no-console
console.log('dbConfig:', dbConfig);

export const AppDataSource = new DataSource({
    ...dbConfig,
    type:
        dbConfig.type === 'postgres'
            ? 'postgres'
            : dbConfig.type === 'mssql'
              ? 'mssql'
              : dbConfig.type === 'mysql'
                ? 'mysql'
                : 'sqlite',
});
