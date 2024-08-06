import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
    title: process.env['TITLE'],
    host: process.env['HOST'] || 'localhost',
    port: Number(process.env['PORT']) || 3000,
}));
