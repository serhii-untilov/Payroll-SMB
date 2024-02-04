import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

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
    const title = configService.get<string>('app.title');
    // handle swagger
    const config = new DocumentBuilder()
        .setTitle(`${title} REST API`)
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/v1', app, document, {
        jsonDocumentUrl: 'api/v1/swagger.json',
    });
    // Run API
    const host = configService.get<string>('app.host');
    const port = configService.get<number>('app.port');
    await app.listen(port);
    logger.log(`🚀 API is running on: http://${host}:${port}/${globalPrefix}`);
}
bootstrap();
