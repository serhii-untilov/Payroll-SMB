import { repositoryMockFactory } from '@repo/utils';
import { Test, TestingModule } from '@nestjs/testing';
import { CompaniesService } from './companies.service';
import { Company } from './entities/company.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockType } from '@repo/utils';
import { Repository } from 'typeorm';

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
