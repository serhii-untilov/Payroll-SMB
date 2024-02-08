import { Test } from '@nestjs/testing';
import { randPassword } from '@ngneat/falso';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { IUser } from '@repo/shared';
import { createMockUser, repositoryMockFactory } from '@repo/utils';
import { UsersService } from '../resources/users/users.service';
import { User } from '../resources/users/entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../resources/users/users.module';

describe('AuthController', () => {
    let controller: AuthController;
    let mockUser: IUser;
    let mockUserUnhashedPassword: string;

    beforeAll(async () => {
        mockUser = createMockUser();
        mockUserUnhashedPassword = mockUser.password;
        mockUser.password = await bcrypt.hash(mockUserUnhashedPassword, 10);
    });

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            imports: [
                JwtModule.register({
                    secret: randPassword(),
                }),
            ],
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: {
                        findOneBy: jest.fn(async (name) => {
                            if (name !== mockUser.name) {
                                return null;
                            }
                            return mockUser;
                        }),
                    },
                },
                {
                    provide: getRepositoryToken(User),
                    useFactory: repositoryMockFactory,
                },
            ],
            controllers: [AuthController],
        }).compile();

        controller = module.get(AuthController);
    });

    it('should be defined', () => {
        expect(controller).toBeTruthy();
    });

    it('should login a user', async () => {
        const res = await controller.signIn({
            name: mockUser.name,
            password: mockUserUnhashedPassword,
        });
        expect(res.access_token).toBeDefined();
        expect(typeof res.access_token).toBe('string');
    });

    it('should throw with a bad email', async () => {
        try {
            await controller.signIn({ name: '', password: '' });
        } catch (err) {
            expect(err).toBeInstanceOf(BadRequestException);
        }
    });
});
