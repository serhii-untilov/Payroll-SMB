import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { appConfig } from '../config/app.config';
import { authConfig } from '../config/auth.config';
import { dbConfig } from '../config/db.config';
import { googleConfig } from '../config/google.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
    let appController: AppController;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    isGlobal: true,
                    load: [appConfig, dbConfig, authConfig, googleConfig],
                }),
            ],
            controllers: [AppController],
            providers: [AppService, ConfigService],
        }).compile();

        appController = app.get<AppController>(AppController);
    });

    describe('root', () => {
        it('should return "Hello World!"', () => {
            expect(appController.getHello()).toBe('Hello World!');
        });
    });
});
