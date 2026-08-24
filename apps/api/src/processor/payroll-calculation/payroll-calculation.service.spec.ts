import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { PayPeriodCalculationService } from '../pay-period-calculation/pay-period-calculation.service';
import { PayrollCalculationService } from './payroll-calculation.service';
import { CompanyService } from '../../resources/company/company.service';
import { PayPeriodService } from '../../resources/pay-period/pay-period.service';
import { PayrollsService } from '../../resources/payrolls/payrolls.service';
import { PositionsService } from '../../resources/positions/positions.service';
import { UserAccessService } from '../../resources/user-access/user-access.service';
import { WorkTimeNormService } from '../../resources/work-time-norm/work-time-norm.service';
import { PaymentTypeService } from '../../resources/payment-type/payment-type.service';

describe('ProcessorService', () => {
    let service: PayrollCalculationService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PayrollCalculationService,
                { provide: UserAccessService, useValue: createMock<UserAccessService>() },
                { provide: PaymentTypeService, useValue: createMock<PaymentTypeService>() },
                { provide: CompanyService, useValue: createMock<CompanyService>() },
                { provide: PositionsService, useValue: createMock<PositionsService>() },
                { provide: PayrollsService, useValue: createMock<PayrollsService>() },
                { provide: PayPeriodService, useValue: createMock<PayPeriodService>() },
                { provide: WorkTimeNormService, useValue: createMock<WorkTimeNormService>() },
                {
                    provide: PayPeriodCalculationService,
                    useValue: createMock<PayPeriodCalculationService>(),
                },
            ],
        }).compile();

        service = await module.resolve<PayrollCalculationService>(PayrollCalculationService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
