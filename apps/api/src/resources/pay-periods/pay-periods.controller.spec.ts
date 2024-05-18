import { createMock } from '@golevelup/ts-jest';
import { Test } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { PayPeriodsController } from './pay-periods.controller';
import { PayPeriodsService } from './pay-periods.service';
import { CompaniesService } from '../companies/companies.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PayPeriod } from './entities/pay-period.entity';
import { repositoryMockFactory } from '@repo/testing';
import { AccessService } from '../access/access.service';
import { PayrollsService } from '../payrolls/payrolls.service';

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
                { provide: CompaniesService, useValue: createMock<CompaniesService>() },
                { provide: AccessService, useValue: createMock<AccessService>() },
                { provide: PayrollsService, useValue: createMock<PayrollsService>() },
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
