import { registerAs } from '@nestjs/config';

export const authConfig = registerAs('auth', () => ({
    accessSecret: process.env['JWT_ACCESS_SECRET'],
    accessExpiration: process.env['JWT_ACCESS_EXPIRATION'],

    refreshSecret: process.env['JWT_REFRESH_SECRET'],
    refreshExpiration: process.env['JWT_REFRESH_EXPIRATION'],
}));
