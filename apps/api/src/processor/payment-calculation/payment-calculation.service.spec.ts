import {
    UserAccessService,
    CompanyService,
    PayFundService,
    PaymentPositionService,
    PaymentsService,
    PaymentTypesService,
    PayPeriodService,
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
                { provide: UserAccessService, useValue: createMock<UserAccessService>() },
                { provide: PaymentTypesService, useValue: createMock<PaymentTypesService>() },
                { provide: CompanyService, useValue: createMock<CompanyService>() },
                { provide: PositionsService, useValue: createMock<PositionsService>() },
                { provide: PayrollsService, useValue: createMock<PayrollsService>() },
                { provide: PayFundService, useValue: createMock<PayFundService>() },
                { provide: PayPeriodService, useValue: createMock<PayPeriodService>() },
                { provide: PaymentsService, useValue: createMock<PaymentsService>() },
                {
                    provide: PaymentPositionService,
                    useValue: createMock<PaymentPositionService>(),
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
