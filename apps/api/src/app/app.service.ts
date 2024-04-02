import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
    constructor(private configService: ConfigService) {}

    getHello(name?: string): string {
        return `Hello ${name || 'World'}!`;
    }

    getTitle(): string {
        return this.configService.get<string>('app.title');
    }
}
