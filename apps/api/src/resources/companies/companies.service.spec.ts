import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { maxDate, minDate, monthBegin, monthEnd } from '@repo/shared';
import { MockType, createMockCompany, repositoryMockFactory } from '@repo/testing';
import { Repository } from 'typeorm';
import { UsersCompanyService } from '../users/users-company.service';
import { UsersService } from '../users/users.service';
import { CompaniesService } from './companies.service';
import { Company } from './entities/company.entity';
import { AccessService } from '../access/access.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('CompaniesService', () => {
    let service: CompaniesService;
    let repoMock: MockType<Repository<Company>>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CompaniesService,
                { provide: getRepositoryToken(Company), useFactory: repositoryMockFactory },
                { provide: UsersService, useValue: createMock<UsersService>() },
                { provide: UsersCompanyService, useValue: createMock<UsersCompanyService>() },
                { provide: AccessService, useValue: createMock<AccessService>() },
                { provide: EventEmitter2, useValue: createMock<EventEmitter2>() },
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
