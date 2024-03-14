import { MockType, createMockCompany, repositoryMockFactory } from '@repo/testing';
import { Test, TestingModule } from '@nestjs/testing';
import { CompaniesService } from './companies.service';
import { Company } from './entities/company.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserCompany } from '../users/entities/user-company.entity';
import { User } from '../users/entities/user.entity';
import { maxDate, minDate, monthBegin, monthEnd } from '@repo/utils';

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

    it('should be filled default values for company mock', () => {
        const company = createMockCompany();
        expect(company.dateFrom).toEqual(minDate());
        expect(company.dateTo).toEqual(maxDate());
        expect(company.payPeriod).toEqual(monthBegin(new Date()));
        expect(company.checkDate).toEqual(monthEnd(new Date()));
        expect(company.deletedDate).toBeUndefined();
        expect(company.deletedUserId).toBeUndefined();
    });
});
