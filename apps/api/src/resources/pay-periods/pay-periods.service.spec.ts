import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockType, repositoryMockFactory } from 'test';
import { Repository } from 'typeorm';
import { AccessService } from '../access/access.service';
import { CompanyService } from '../company/company.service';
import { PayFundsService } from '../pay-funds/pay-funds.service';
import { PayrollsService } from '../payrolls/payrolls.service';
import { PositionsService } from '../positions/positions.service';
import { UserService } from '../users/users.service';
import { PayPeriod } from './entities/pay-period.entity';
import { PayPeriodsService } from './pay-periods.service';

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
                { provide: UserService, useValue: createMock<UserService>() },
                { provide: AccessService, useValue: createMock<AccessService>() },
                { provide: CompanyService, useValue: createMock<CompanyService>() },
                { provide: PositionsService, useValue: createMock<PositionsService>() },
                { provide: PayrollsService, useValue: createMock<PayrollsService>() },
                { provide: PayFundsService, useValue: createMock<PayFundsService>() },
                { provide: UserService, useValue: createMock<UserService>() },
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
