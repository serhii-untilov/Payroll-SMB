import { Test, TestingModule } from '@nestjs/testing';
import { AccessService } from './access.service';
import { Access } from './entities/access.entity';
import { MockType, repositoryMockFactory } from '@repo/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { createMock } from '@golevelup/ts-jest';

describe('AccessService', () => {
    let service: AccessService;
    let repoMock: MockType<Repository<Access>>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AccessService,
                {
                    provide: getRepositoryToken(Access),
                    useFactory: repositoryMockFactory,
                },
                { provide: UsersService, useValue: createMock<UsersService>() },
            ],
        }).compile();

        service = module.get<AccessService>(AccessService);
        repoMock = module.get(getRepositoryToken(Access));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(repoMock).toBeTruthy();
    });
});
