import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fsPromise from 'fs/promises';

@Injectable()
export class AppService {
    constructor(private configService: ConfigService) {}

    getHello(name?: string): string {
        return `Hello ${name || 'World'}!`;
    }

    getTitle(): string {
        const title = this.configService.get<string>('app.title') || 'Payroll SMB';
        return title;
    }

    async addLocaleKey(lng: string, _ns: string, key: string) {
        if (process.env['NODE_ENV'] === 'development') {
            const fileName = `./locales/${lng}/add.json`;
            const loadedLocale = await this.readLocale(fileName);
            const config = loadedLocale ? JSON.parse(loadedLocale) : {};
            if (!config[key]) {
                config[key] = '';
                const json = JSON.stringify(config);
                await this.writeLocale(fileName, json);
            }
        }
    }

    async readLocale(fileName: string): Promise<string | null> {
        try {
            return await fsPromise.readFile(fileName, 'utf-8');
        } catch (_error) {
            return null;
        }
    }

    async writeLocale(fileName: string, content: string) {
        try {
            return await fsPromise.writeFile(fileName, content);
        } catch (error) {
            this._logger.error(error.message);
        }
    }
}
