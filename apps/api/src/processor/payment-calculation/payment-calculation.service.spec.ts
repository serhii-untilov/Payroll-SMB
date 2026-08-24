import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { PayPeriodCalculationService } from '../pay-period-calculation/pay-period-calculation.service';
import { PaymentCalculationService } from './payment-calculation.service';
import { CompanyService } from '../../resources/company/company.service';
import { PayFundService } from '../../resources/pay-fund/pay-fund.service';
import { PayPeriodService } from '../../resources/pay-period/pay-period.service';
import { PaymentPositionService } from '../../resources/payment-position/payment-position.service';
import { PaymentsService } from '../../resources/payments/payments.service';
import { PayrollsService } from '../../resources/payrolls/payrolls.service';
import { PositionsService } from '../../resources/positions/positions.service';
import { UserAccessService } from '../../resources/user-access/user-access.service';
import { PaymentTypeService } from '../../resources/payment-type/payment-type.service';

describe('PaymentCalculationService', () => {
    let service: PaymentCalculationService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PaymentCalculationService,
                { provide: UserAccessService, useValue: createMock<UserAccessService>() },
                { provide: PaymentTypeService, useValue: createMock<PaymentTypeService>() },
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
