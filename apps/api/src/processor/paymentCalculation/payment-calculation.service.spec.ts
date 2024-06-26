import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { PayPeriodCalculationService } from '../payPeriodCalculation/payPeriodCalculation.service';
import { AccessService } from './../../resources/access/access.service';
import { CompaniesService } from './../../resources/companies/companies.service';
import { PayPeriodsService } from './../../resources/pay-periods/payPeriods.service';
import { PaymentTypesService } from './../../resources/payment-types/payment-types.service';
import { PaymentPositionsService } from './../../resources/payments/payment-positions.service';
import { PaymentsService } from './../../resources/payments/payments.service';
import { PayrollsService } from './../../resources/payrolls/payrolls.service';
import { PositionsService } from './../../resources/positions/positions.service';
import { PaymentCalculationService } from './payment-calculation.service';
import { PayFundsService } from './../../resources/pay-funds/pay-funds.service';

describe('PaymentCalculationService', () => {
    let service: PaymentCalculationService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PaymentCalculationService,
                { provide: AccessService, useValue: createMock<AccessService>() },
                { provide: PaymentTypesService, useValue: createMock<PaymentTypesService>() },
                { provide: CompaniesService, useValue: createMock<CompaniesService>() },
                { provide: PositionsService, useValue: createMock<PositionsService>() },
                { provide: PayrollsService, useValue: createMock<PayrollsService>() },
                { provide: PayFundsService, useValue: createMock<PayFundsService>() },
                { provide: PayPeriodsService, useValue: createMock<PayPeriodsService>() },
                { provide: PaymentsService, useValue: createMock<PaymentsService>() },
                {
                    provide: PaymentPositionsService,
                    useValue: createMock<PaymentPositionsService>(),
                },
                {
                    provide: PayPeriodCalculationService,
                    useValue: createMock<PayPeriodCalculationService>(),
                },
            ],
        }).compile();

        service = await module.resolve<PaymentCalculationService>(PaymentCalculationService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
