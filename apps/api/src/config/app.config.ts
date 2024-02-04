import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
    title: process.env['TITLE'],
    host: process.env['HOST'],
    port: process.env['PORT'],
}));
