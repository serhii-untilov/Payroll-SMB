import {
    UserAccessService,
    CompanyService,
    MinWageService,
    PayFundService,
    PayFundTypesService,
    PaymentTypesService,
    PayPeriodService,
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
                { provide: UserAccessService, useValue: createMock<UserAccessService>() },
                { provide: PayFundTypesService, useValue: createMock<PayFundTypesService>() },
                { provide: PaymentTypesService, useValue: createMock<PaymentTypesService>() },
                { provide: CompanyService, useValue: createMock<CompanyService>() },
                { provide: PositionsService, useValue: createMock<PositionsService>() },
                { provide: PayFundService, useValue: createMock<PayFundService>() },
                { provide: PayrollsService, useValue: createMock<PayrollsService>() },
                { provide: PayPeriodService, useValue: createMock<PayPeriodService>() },
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
