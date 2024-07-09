import { Controller, Get, Header, Logger, Param, Post, StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';
import { AppService } from './app.service';

@Controller()
export class AppController {
    private _logger: Logger = new Logger(AppController.name);

    constructor(private readonly appService: AppService) {}

    @Get('/')
    getHello(): string {
        return this.appService.getHello();
    }

    @Get('/title')
    getTitle(): string {
        return this.appService.getTitle();
    }

    @Get('/locales/:lang/:ns.json')
    @Header('Content-Type', 'application/json')
    getLocales(@Param() params): StreamableFile {
        const fileName = join(process.cwd(), 'locales', params.lang, `${params.ns}.json`);
        // console.log(params, fileName);
        const file = createReadStream(fileName);
        return new StreamableFile(file);
    }

    @Post('/locales/add/:lng/:ns')
    @Header('Content-Type', 'application/json')
    addLocales(@Param() params) {
        this._logger.log('/locales/add/', params);
    }
}
