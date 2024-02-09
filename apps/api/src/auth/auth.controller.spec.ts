import { Test } from '@nestjs/testing';
import { randPassword } from '@ngneat/falso';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { IUser } from '@repo/shared';
import { MockType, createMockUser, repositoryMockFactory } from '@repo/utils';
import { UsersService } from '../resources/users/users.service';
import { User } from '../resources/users/entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

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
                JwtModule.register({
                    secret: randPassword(),
                }),
            ],
            providers: [
                AuthService,
                UsersService,
                ConfigService,
                {
                    provide: getRepositoryToken(User),
                    useFactory: repositoryMockFactory,
                },
            ],
            controllers: [AuthController],
            exports: [UsersService],
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
        const res = await controller.signIn({
            name: mockUser.name,
            password: mockUserUnhashedPassword,
        });
        expect(res.access_token).toBeDefined();
        expect(typeof res.access_token).toBe('string');
    });

    it('should throw with a bad email', async () => {
        try {
            repoMock.findOneBy?.mockReturnValue(null);
            await controller.signIn({ name: '', password: '' });
        } catch (err) {
            expect(err).toBeInstanceOf(BadRequestException);
        }
    });
});
