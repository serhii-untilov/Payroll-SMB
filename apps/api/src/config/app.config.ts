import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
    host: process.env['HOST'],
    port: process.env['PORT'],
}));
