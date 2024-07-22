import {
    AccessService,
    CompaniesService,
    PayFundsService,
    PaymentPositionsService,
    PaymentsService,
    PaymentTypesService,
    PayPeriodsService,
    PayrollsService,
    PositionsService,
} from '@/resources';
import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { PayPeriodCalculationService } from '../pay-period-calculation/pay-period-calculation.service';
import { PaymentCalculationService } from './payment-calculation.service';

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
