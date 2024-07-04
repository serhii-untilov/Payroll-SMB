import { registerAs } from '@nestjs/config';

export const dbConfig = registerAs('db', () => ({
    type: process.env['DATABASE_TYPE'],
    host: process.env['DATABASE_HOST'],
    port: Number(process.env['DATABASE_PORT']),
    password: process.env['DATABASE_PASSWORD'],
    name: process.env['DATABASE_NAME'],
    path: process.env['DATABASE_PATH'],
    username: process.env['DATABASE_USERNAME'],
    migrationsRun: process.env['DATABASE_MIGRATIONS_RUN'] === 'true',
    synchronize: process.env['DATABASE_SYNCHRONIZE'] === 'false',
    logging: process.env['DATABASE_LOGGING_ENABLED'] === 'true',

    entities: ['./src/resources/**/*entity.ts'],
    migrations: ['./src/migrations/**/*.ts'],
    // subscribers: ['./src/subscribers/*subscriber.ts', './src/resources/**/*subscriber.ts'],
}));
