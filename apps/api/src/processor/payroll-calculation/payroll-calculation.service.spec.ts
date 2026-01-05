import {
    UserAccessService,
    CompanyService,
    PaymentTypesService,
    PayPeriodsService,
    PayrollsService,
    PositionsService,
    WorkTimeNormService,
} from '@/resources';
import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { PayPeriodCalculationService } from '../pay-period-calculation/pay-period-calculation.service';
import { PayrollCalculationService } from './payroll-calculation.service';

describe('ProcessorService', () => {
    let service: PayrollCalculationService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PayrollCalculationService,
                { provide: UserAccessService, useValue: createMock<UserAccessService>() },
                { provide: PaymentTypesService, useValue: createMock<PaymentTypesService>() },
                { provide: CompanyService, useValue: createMock<CompanyService>() },
                { provide: PositionsService, useValue: createMock<PositionsService>() },
                { provide: PayrollsService, useValue: createMock<PayrollsService>() },
                { provide: PayPeriodsService, useValue: createMock<PayPeriodsService>() },
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
