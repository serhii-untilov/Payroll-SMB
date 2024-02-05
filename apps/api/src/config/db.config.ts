import { registerAs } from '@nestjs/config';

export const dbConfig = registerAs('db', () => ({
    type: process.env['DATABASE_TYPE'] || 'sqlite',
    host: process.env['DATABASE_HOST'],
    port: +process.env['DATABASE_PORT'],
    password: process.env['DATABASE_PASSWORD'],
    name: process.env['DATABASE_NAME'],
    path: process.env['DATABASE_PATH'] || './db.sqlite',
    username: process.env['DATABASE_USERNAME'],
    migrationsRun: process.env['DATABASE_MIGRATIONS_RUN'] === 'true',
    synchronize: process.env['DATABASE_SYNCHRONIZE'] === 'true',
    logging: process.env['DATABASE_LOGGING_ENABLED'] === 'true',
    database: process.env['DATABASE_SQLITE'],

    entities: ['./src/**/*entity.ts'],
    migrations: ['./migrations/**/*.ts'],
    subscribers: ['./src/**/*subscriber.ts'],
}));
