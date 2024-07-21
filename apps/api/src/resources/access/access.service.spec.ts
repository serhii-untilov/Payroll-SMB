import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockType, repositoryMockFactory } from 'test';
import { Repository } from 'typeorm';
import { AccessService } from './access.service';
import { Access } from './entities/access.entity';
import { User } from '../users/entities/user.entity';
import { UserCompany } from '../user-companies/entities/user-company.entity';

describe('AccessService', () => {
    let service: AccessService;
    let repoMock: MockType<Repository<Access>>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AccessService,
                { provide: getRepositoryToken(Access), useFactory: repositoryMockFactory },
                { provide: getRepositoryToken(User), useFactory: repositoryMockFactory },
                { provide: getRepositoryToken(UserCompany), useFactory: repositoryMockFactory },
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
