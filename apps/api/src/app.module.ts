import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UsersModule } from './modules/users/users.module';
import { appConfig } from './config/app.config';
import { dbConfig } from './config/db.config';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['./.env', '../../.env'],
            ignoreEnvVars: true,
            load: [appConfig, dbConfig],
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
