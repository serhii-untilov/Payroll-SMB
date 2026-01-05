import { User } from './../resources/user/entities/user.entity';
import { appConfig, authConfig, dbConfig, googleConfig } from '@/config';
import { UserAccessService, UserService } from '@/resources';
import { createMock } from '@golevelup/ts-jest';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { randPassword } from '@ngneat/falso';
import { createMockUser } from 'test';
import * as bcrypt from 'bcrypt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
    let controller: AuthController;
    let mockUser: User;
    let mockUserUnhashedPassword: string;

    beforeAll(async () => {
        mockUser = createMockUser();
        mockUserUnhashedPassword = mockUser.passwordHash;
        mockUser.passwordHash = await bcrypt.hash(mockUserUnhashedPassword, 10);
    });

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    isGlobal: true,
                    load: [appConfig, dbConfig, authConfig, googleConfig],
                }),
                JwtModule.register({
                    secret: randPassword(),
                }),
            ],
            providers: [
                AuthService,
                ConfigService,
                { provide: UserService, useValue: createMock<UserService>() },
                { provide: UserAccessService, useValue: createMock<UserAccessService>() },
            ],
            controllers: [AuthController],
            exports: [],
        }).compile();

        controller = module.get(AuthController);
    });

    it('should be defined', () => {
        expect(controller).toBeTruthy();
    });
});
