import { registerAs } from '@nestjs/config';

export const authConfig = registerAs('auth', () => ({
    secret: process.env['JWT_SECRET'],
    expires: process.env['JWT_ACCESS_TOKEN_EXPIRES_IN'],
}));
