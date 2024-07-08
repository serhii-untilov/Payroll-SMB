import { VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import metadata from './metadata';
import path from 'path';
import { writeFileSync } from 'fs';
import { capitalizeFirstLetter } from '@repo/shared';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
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
        // .addTag('payrollSmb')
        .addBearerAuth()
        .build();
    await SwaggerModule.loadPluginMetadata(metadata);
    const document = SwaggerModule.createDocument(app, config, {
        operationIdFactory: (controllerKey, methodKey) =>
            `${controllerKey}${capitalizeFirstLetter(methodKey)}`.replace('Controller', ''),
    });
    const apiVersion = 'v1';
    const apiFileName = 'swagger';
    SwaggerModule.setup(`${globalPrefix}/${apiVersion}`, app, document, {
        jsonDocumentUrl: `${globalPrefix}/${apiVersion}/${apiFileName}.json`,
        yamlDocumentUrl: `${globalPrefix}/${apiVersion}/${apiFileName}.yaml`,
    });
    const outputPath = path.resolve(process.cwd(), 'swagger.json');
    writeFileSync(outputPath, JSON.stringify(document), { encoding: 'utf8' });
    await app.close();
}
bootstrap();
