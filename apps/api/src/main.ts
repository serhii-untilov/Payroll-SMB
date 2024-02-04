import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, VersioningType } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const logger = new Logger(bootstrap.name);
    const globalPrefix = 'api';
    app.setGlobalPrefix(globalPrefix);
    const configService = app.get(ConfigService);
    // set up versioning
    app.enableVersioning({ type: VersioningType.URI, prefix: 'v' });
    // TODO - revisit and secure this!
    // app.enableCors({ origin: '*' });
    const host = configService.get<string>('app.host');
    const port = configService.get<number>('app.port');
    await app.listen(port);
    logger.log(`🚀 API is running on: http://${host}:${port}/${globalPrefix}`);
}
bootstrap();
