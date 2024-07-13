import { createMock } from '@golevelup/ts-jest';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from '@repo/testing';
import { AccessService } from '../access/access.service';
import { CompaniesService } from '../companies/companies.service';
import { PayFundsService } from '../pay-funds/pay-funds.service';
import { PayrollsService } from '../payrolls/payrolls.service';
import { PositionsService } from '../positions/positions.service';
import { UsersService } from '../users/users.service';
import { PayPeriod } from './entities/pay-period.entity';
import { PayPeriodsController } from './pay-periods.controller';
import { PayPeriodsService } from './pay-periods.service';

describe('PayPeriodsController', () => {
    let controller: PayPeriodsController;
    let service: PayPeriodsService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            controllers: [PayPeriodsController],
            providers: [
                PayPeriodsService,
                {
                    provide: getRepositoryToken(PayPeriod),
                    useFactory: repositoryMockFactory,
                },
                { provide: UsersService, useValue: createMock<UsersService>() },
                { provide: AccessService, useValue: createMock<AccessService>() },
                { provide: CompaniesService, useValue: createMock<CompaniesService>() },
                { provide: PositionsService, useValue: createMock<PositionsService>() },
                { provide: PayrollsService, useValue: createMock<PayrollsService>() },
                { provide: PayFundsService, useValue: createMock<PayFundsService>() },
                { provide: UsersService, useValue: createMock<UsersService>() },
            ],
        }).compile();

        controller = module.get<PayPeriodsController>(PayPeriodsController);
        service = module.get<PayPeriodsService>(PayPeriodsService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(service).toBeDefined();
    });
});
