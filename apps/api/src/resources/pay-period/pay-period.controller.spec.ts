import { createMock } from '@golevelup/ts-jest';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from '@/test';
import { UserAccessService } from '../user-access/user-access.service';
import { CompanyService } from '../company/company.service';
import { PayFundService } from '../pay-fund/pay-fund.service';
import { PayrollsService } from '../payrolls/payrolls.service';
import { PositionsService } from '../positions/positions.service';
import { UserService } from '../users/users.service';
import { PayPeriod } from './entities/pay-period.entity';
import { PayPeriodController } from './pay-period.controller';
import { PayPeriodService } from './pay-period.service';

describe('PayPeriodController', () => {
    let controller: PayPeriodController;
    let service: PayPeriodService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            controllers: [PayPeriodController],
            providers: [
                PayPeriodService,
                {
                    provide: getRepositoryToken(PayPeriod),
                    useFactory: repositoryMockFactory,
                },
                { provide: UserService, useValue: createMock<UserService>() },
                { provide: UserAccessService, useValue: createMock<UserAccessService>() },
                { provide: CompanyService, useValue: createMock<CompanyService>() },
                { provide: PositionsService, useValue: createMock<PositionsService>() },
                { provide: PayrollsService, useValue: createMock<PayrollsService>() },
                { provide: PayFundService, useValue: createMock<PayFundService>() },
                { provide: UserService, useValue: createMock<UserService>() },
            ],
        }).compile();

        controller = module.get<PayPeriodController>(PayPeriodController);
        service = module.get<PayPeriodService>(PayPeriodService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(service).toBeDefined();
    });
});
