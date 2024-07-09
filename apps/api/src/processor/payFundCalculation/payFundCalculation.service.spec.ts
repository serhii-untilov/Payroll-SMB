import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { AccessService } from '@/resources/access/access.service';
import { CompaniesService } from '@/resources/companies/companies.service';
import { MinWageService } from '@/resources/min-wage/min-wage.service';
import { PayFundTypesService } from '@/resources/pay-fund-types/pay-fund-types.service';
import { PayFundsService } from '@/resources/pay-funds/pay-funds.service';
import { PayPeriodsService } from '@/resources/pay-periods/payPeriods.service';
import { PaymentTypesService } from '@/resources/payment-types/payment-types.service';
import { PayrollsService } from '@/resources/payrolls/payrolls.service';
import { PositionsService } from '@/resources/positions/positions.service';
import { PayFundCalculationService } from './payFundCalculation.service';
import { PayPeriodCalculationService } from '../payPeriodCalculation/payPeriodCalculation.service';

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
