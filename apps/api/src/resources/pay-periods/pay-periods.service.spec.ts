import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockType, repositoryMockFactory } from '@repo/testing';
import { Repository } from 'typeorm';
import { PayPeriod } from './entities/pay-period.entity';
import { PayPeriodsService } from './pay-periods.service';
import { UsersService } from '../users/users.service';
import { CompaniesService } from '../companies/companies.service';
import { createMock } from '@golevelup/ts-jest';

describe('PayPeriodsService', () => {
    let service: PayPeriodsService;
    let repoMock: MockType<Repository<PayPeriod>>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PayPeriodsService,
                {
                    provide: getRepositoryToken(PayPeriod),
                    useFactory: repositoryMockFactory,
                },
                { provide: UsersService, useValue: createMock<UsersService>() },
                { provide: CompaniesService, useValue: createMock<CompaniesService>() },
            ],
        }).compile();

        service = module.get<PayPeriodsService>(PayPeriodsService);
        repoMock = module.get(getRepositoryToken(PayPeriod));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(repoMock).toBeTruthy();
    });
});
