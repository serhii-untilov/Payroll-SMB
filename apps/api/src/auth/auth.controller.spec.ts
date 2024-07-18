import { appConfig, authConfig, dbConfig, googleConfig } from '@/config';
import { AccessService } from '@/resources/access/access.service';
import { User } from '@/resources/users/entities/user.entity';
import { UsersService } from '@/resources/users/users.service';
import { createMock } from '@golevelup/ts-jest';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { randPassword } from '@ngneat/falso';
import { createMockUser } from '@repo/testing';
import * as bcrypt from 'bcrypt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
    let controller: AuthController;
    let mockUser: User;
    let mockUserUnhashedPassword: string;

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
                { provide: UsersService, useValue: createMock<UsersService>() },
                { provide: AccessService, useValue: createMock<AccessService>() },
            ],
            controllers: [AuthController],
            exports: [],
        }).compile();

        controller = module.get(AuthController);
    });

    it('should be defined', () => {
        expect(controller).toBeTruthy();
    });

    // it('should login a user', async () => {
    //     repoMock.findOneBy?.mockReturnValue(mockUser);
    //     const res = await controller.login({
    //         ...mockUser,
    //         password: mockUserUnhashedPassword,
    //         rememberMe: false,
    //     });
    //     expect(res.accessToken).toBeDefined();
    //     expect(typeof res.accessToken).toBe('string');
    // });

    // it('should throw with a bad email', async () => {
    //     try {
    //         repoMock.findOneBy?.mockReturnValue(null);
    //         await controller.login({ email: '', password: '', rememberMe: false });
    //     } catch (err) {
    //         expect(err).toBeInstanceOf(BadRequestException);
    //     }
    // });
});
