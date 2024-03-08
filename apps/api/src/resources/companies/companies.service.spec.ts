import { repositoryMockFactory } from '@repo/utils';
import { Test, TestingModule } from '@nestjs/testing';
import { CompaniesService } from './companies.service';
import { Company } from './entities/company.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockType } from '@repo/utils';
import { Repository } from 'typeorm';
import { UserCompany } from '../users/entities/user-company.entity';
import { User } from '../users/entities/user.entity';

describe('CompaniesService', () => {
    let service: CompaniesService;
    let repoMock: MockType<Repository<Company>>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CompaniesService,
                {
                    provide: getRepositoryToken(Company),
                    useFactory: repositoryMockFactory,
                },
                {
                    provide: getRepositoryToken(UserCompany),
                    useFactory: repositoryMockFactory,
                },
                {
                    provide: getRepositoryToken(User),
                    useFactory: repositoryMockFactory,
                },
            ],
        }).compile();

        service = module.get<CompaniesService>(CompaniesService);
        repoMock = module.get(getRepositoryToken(Company));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(repoMock).toBeTruthy();
    });
});
