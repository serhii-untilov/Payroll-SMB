import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import 'reflect-metadata';
import metadata from './metadata';

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

    // handle Swagger
    const config = new DocumentBuilder()
        .setTitle(`${title} REST API`)
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    await SwaggerModule.loadPluginMetadata(metadata);
    const document = SwaggerModule.createDocument(app, config);
    const apiVersion = 'v1';
    const apiFileName = 'swagger';
    SwaggerModule.setup(`${globalPrefix}/${apiVersion}`, app, document, {
        jsonDocumentUrl: `${globalPrefix}/${apiVersion}/${apiFileName}.json`,
        yamlDocumentUrl: `${globalPrefix}/${apiVersion}/${apiFileName}.yaml`,
    });

    // Run API
    const host = configService.get<string>('app.host');
    const port = configService.get<number>('app.port') || 3000;
    await app.listen(port);

    logger.log(`Application: http://${host}:${port}`);
    logger.log(`API: http://${host}:${port}/${globalPrefix}`);
    logger.log(`Open API by Swagger:`);
    logger.log(`http://${host}:${port}/${globalPrefix}/${apiVersion}`);
    logger.log(`http://${host}:${port}/${globalPrefix}/${apiVersion}/${apiFileName}.json`);
    logger.log(`http://${host}:${port}/${globalPrefix}/${apiVersion}/${apiFileName}.yaml`);
}
bootstrap();
