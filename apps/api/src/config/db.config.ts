import { registerAs } from '@nestjs/config';

export const dbConfig = registerAs('db', () => ({
    type: process.env['DATABASE_TYPE'],
    host: process.env['DATABASE_HOST'],
    port: process.env['DATABASE_PORT'],
    password: process.env['DATABASE_PASSWORD'],
    name: process.env['DATABASE_NAME'],
    path: process.env['DATABASE_PATH'],
    username: process.env['DATABASE_USERNAME'],
    synchronize: process.env['DATABASE_SYNCHRONIZE'] === 'true',
    logging: process.env['DATABASE_LOGGING_ENABLED'] === 'true',
}));
