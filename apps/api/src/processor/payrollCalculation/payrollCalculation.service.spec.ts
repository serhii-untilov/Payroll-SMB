import { AccessService } from '@/resources/access/access.service';
import { CompaniesService } from '@/resources/companies/companies.service';
import { PayPeriodsService } from '@/resources/pay-periods/pay-periods.service';
import { PaymentTypesService } from '@/resources/payment-types/payment-types.service';
import { PayrollsService } from '@/resources/payrolls/payrolls.service';
import { PositionsService } from '@/resources/positions/positions.service';
import { WorkNormsService } from '@/resources/work-norms/work-norms.service';
import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { PayPeriodCalculationService } from '../payPeriodCalculation/payPeriodCalculation.service';
import { PayrollCalculationService } from './payrollCalculation.service';

describe('ProcessorService', () => {
    let service: PayrollCalculationService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PayrollCalculationService,
                { provide: AccessService, useValue: createMock<AccessService>() },
                { provide: PaymentTypesService, useValue: createMock<PaymentTypesService>() },
                { provide: CompaniesService, useValue: createMock<CompaniesService>() },
                { provide: PositionsService, useValue: createMock<PositionsService>() },
                { provide: PayrollsService, useValue: createMock<PayrollsService>() },
                { provide: PayPeriodsService, useValue: createMock<PayPeriodsService>() },
                { provide: WorkNormsService, useValue: createMock<WorkNormsService>() },
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
