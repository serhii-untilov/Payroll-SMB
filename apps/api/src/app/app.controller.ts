import { Body, Controller, Get, Header, Param, Post, StreamableFile } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { createReadStream } from 'fs';
import { join } from 'path';
import { AppService } from './app.service';

@Controller()
export class AppController {
    constructor(private readonly service: AppService) {}

    @Get('/')
    getHello(): string {
        return this.service.getHello();
    }

    @Get('/ping')
    @ApiOperation({
        summary: 'Ping',
        description: 'Get response for a health checker',
    })
    ping(): string {
        return 'pong';
    }

    @Get('/title')
    getTitle(): string {
        return this.service.getTitle();
    }

    @Get('/locales/:lang/:ns.json')
    @Header('Content-Type', 'application/json')
    getLocales(@Param('lang') lang: string, @Param('ns') ns: string): StreamableFile {
        const fileName = join(process.cwd(), 'locales', lang, `${ns}.json`);
        const file = createReadStream(fileName);
        return new StreamableFile(file);
    }

    @Post('/locales/add/:lng/:ns')
    @Header('Content-Type', 'application/json')
    async addLocales(@Param('lng') lng: string, @Param('ns') ns: string, @Body() payload: { key: string }) {
        const { key } = payload;
        await this.service.addLocaleKey(lng, ns, key);
    }
}
