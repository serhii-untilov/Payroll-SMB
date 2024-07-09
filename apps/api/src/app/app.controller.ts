import { Body, Controller, Get, Header, Logger, Param, Post, StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';
import { AppService } from './app.service';

@Controller()
export class AppController {
    private _logger: Logger = new Logger(AppController.name);

    constructor(private readonly service: AppService) {}

    @Get('/')
    getHello(): string {
        return this.service.getHello();
    }

    @Get('/title')
    getTitle(): string {
        return this.service.getTitle();
    }

    @Get('/locales/:lang/:ns.json')
    @Header('Content-Type', 'application/json')
    getLocales(@Param() params: { lang: string; ns: string }): StreamableFile {
        const fileName = join(process.cwd(), 'locales', params.lang, `${params.ns}.json`);
        const file = createReadStream(fileName);
        return new StreamableFile(file);
    }

    @Post('/locales/add/:lng/:ns')
    @Header('Content-Type', 'application/json')
    async addLocales(
        @Param() params: { lng: string; ns: string },
        @Body() payload: { key: string },
    ) {
        const { lng, ns } = params;
        const { key } = payload;
        await this.service.addLocaleKey(lng, ns, key);
    }
}
