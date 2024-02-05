import { dbConfig } from 'models';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UsersModule } from '../modules/users/users.module';
import { appConfig } from '../config/app.config';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            ignoreEnvFile: true,
            ignoreEnvVars: false,
            load: [appConfig],
        }),
        TypeOrmModule.forRoot({
            ...dbConfig,
            type:
                dbConfig.type === 'postgres'
                    ? 'postgres'
                    : dbConfig.type === 'mssql'
                      ? 'mssql'
                      : dbConfig.type === 'mysql'
                        ? 'mysql'
                        : 'sqlite',
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
