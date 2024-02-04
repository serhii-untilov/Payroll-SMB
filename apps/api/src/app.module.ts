import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UsersModule } from './modules/users/users.module';

@Module({
    imports: [
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '../..', 'web', 'dist'),
        }),
        UsersModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
