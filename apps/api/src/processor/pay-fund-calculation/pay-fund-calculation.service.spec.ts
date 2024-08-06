import {
    AccessService,
    CompaniesService,
    MinWageService,
    PayFundsService,
    PayFundTypesService,
    PaymentTypesService,
    PayPeriodsService,
    PayrollsService,
    PositionsService,
} from '@/resources';
import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { PayPeriodCalculationService } from '../pay-period-calculation/pay-period-calculation.service';
import { PayFundCalculationService } from './pay-fund-calculation.service';

describe('PayFundCalculationService', () => {
    let service: PayFundCalculationService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PayFundCalculationService,
                { provide: AccessService, useValue: createMock<AccessService>() },
                { provide: PayFundTypesService, useValue: createMock<PayFundTypesService>() },
                { provide: PaymentTypesService, useValue: createMock<PaymentTypesService>() },
                { provide: CompaniesService, useValue: createMock<CompaniesService>() },
                { provide: PositionsService, useValue: createMock<PositionsService>() },
                { provide: PayFundsService, useValue: createMock<PayFundsService>() },
                { provide: PayrollsService, useValue: createMock<PayrollsService>() },
                { provide: PayPeriodsService, useValue: createMock<PayPeriodsService>() },
                { provide: MinWageService, useValue: createMock<MinWageService>() },
                {
                    provide: PayPeriodCalculationService,
                    useValue: createMock<PayPeriodCalculationService>(),
                },
            ],
        }).compile();

        service = await module.resolve<PayFundCalculationService>(PayFundCalculationService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
