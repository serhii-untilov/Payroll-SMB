import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { PayPeriodCalculationService } from '../pay-period-calculation/pay-period-calculation.service';
import { PayFundCalculationService } from './pay-fund-calculation.service';
import { CompanyService } from '../../resources/company/company.service';
import { MinWageService } from '../../resources/min-wage/min-wage.service';
import { PayFundService } from '../../resources/pay-fund/pay-fund.service';
import { PayFundTypesService } from '../../resources/pay-fund-types/pay-fund-types.service';
import { PayPeriodService } from '../../resources/pay-period/pay-period.service';
import { PayrollsService } from '../../resources/payrolls/payrolls.service';
import { PositionsService } from '../../resources/positions/positions.service';
import { UserAccessService } from '../../resources/user-access/user-access.service';
import { PaymentTypeService } from '../../resources/payment-type/payment-type.service';

describe('PayFundCalculationService', () => {
    let service: PayFundCalculationService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PayFundCalculationService,
                { provide: UserAccessService, useValue: createMock<UserAccessService>() },
                { provide: PayFundTypesService, useValue: createMock<PayFundTypesService>() },
                { provide: PaymentTypeService, useValue: createMock<PaymentTypeService>() },
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
