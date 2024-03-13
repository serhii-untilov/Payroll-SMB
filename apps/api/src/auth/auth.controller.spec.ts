import { Test } from '@nestjs/testing';
import { randPassword } from '@ngneat/falso';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { IUser } from '@repo/shared';
import { MockType, createMockUser, repositoryMockFactory } from '@repo/testing';
import { User } from '../resources/users/entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Repository } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { appConfig } from '../config/app.config';
import { dbConfig } from '../config/db.config';
import { authConfig } from '../config/auth.config';
import { googleConfig } from '../config/google.config';

describe('AuthController', () => {
    let controller: AuthController;
    let mockUser: IUser;
    let mockUserUnhashedPassword: string;
    let repoMock: MockType<Repository<User>>;

    beforeAll(async () => {
        mockUser = createMockUser();
        mockUserUnhashedPassword = mockUser.password;
        mockUser.password = await bcrypt.hash(mockUserUnhashedPassword, 10);
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
                {
                    provide: getRepositoryToken(User),
                    useFactory: repositoryMockFactory,
                },
            ],
            controllers: [AuthController],
            exports: [],
        }).compile();

        controller = module.get(AuthController);
        repoMock = module.get(getRepositoryToken(User));
    });

    it('should be defined', () => {
        expect(controller).toBeTruthy();
        expect(repoMock).toBeTruthy();
    });

    it('should login a user', async () => {
        repoMock.findOneBy?.mockReturnValue(mockUser);
        const res = await controller.login({
            ...mockUser,
            password: mockUserUnhashedPassword,
            rememberMe: false,
        });
        expect(res.accessToken).toBeDefined();
        expect(typeof res.accessToken).toBe('string');
    });

    it('should throw with a bad email', async () => {
        try {
            repoMock.findOneBy?.mockReturnValue(null);
            await controller.login({ email: '', password: '', rememberMe: false });
        } catch (err) {
            expect(err).toBeInstanceOf(BadRequestException);
        }
    });
});
