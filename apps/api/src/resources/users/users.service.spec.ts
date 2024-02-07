import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { MockType } from 'src/testing/mock-type';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { repositoryMockFactory } from '../../testing/repo-mock.factory';

describe('UsersService', () => {
    let service: UsersService;
    let repoMock: MockType<Repository<User>>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: getRepositoryToken(User),
                    useFactory: repositoryMockFactory,
                },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
        repoMock = module.get(getRepositoryToken(User));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(repoMock).toBeTruthy();
    });
});
