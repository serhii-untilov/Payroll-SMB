import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UsersModule } from '../resources/users/users.module';
import { appConfig } from '../config/app.config';
import { dbConfig } from '../config/db.config';
import { googleConfig } from 'src/config/google.config';
import { TypeormConfigService } from 'src/config/typeorm-config.service';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            // envFilePath: ['.env'],
            // ignoreEnvVars: true,
            // ignoreEnvFile: true,
            load: [appConfig, dbConfig, googleConfig],
        }),
        TypeOrmModule.forRootAsync({
            useClass: TypeormConfigService,
            inject: [ConfigService],
        }),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '../..', 'web', 'dist'),
        }),
        UsersModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
