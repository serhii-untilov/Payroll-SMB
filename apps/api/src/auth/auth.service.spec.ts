import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../resources/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../resources/users/entities/user.entity';
import { repositoryMockFactory } from '@repo/utils';
import { ConfigService } from '@nestjs/config';

describe('AuthService', () => {
    let service: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                UsersService,
                JwtService,
                ConfigService,
                {
                    provide: getRepositoryToken(User),
                    useFactory: repositoryMockFactory,
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
