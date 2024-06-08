import { Test, TestingModule } from '@nestjs/testing';
import { CompanyListenerService } from './company-listener.service';
import { PayrollCalculationService } from '../../../processor/payrollCalculation/payrollCalculation.service';
import { createMock } from '@golevelup/ts-jest';
import { PayFundCalculationService } from './../../../processor/payFundCalculation/payFundCalculation.service';
import { PayPeriodsService } from './../../../resources/pay-periods/pay-periods.service';
import { TaskGenerationService } from '../../taskGeneration/taskGeneration.service';

describe('CompanyListenerService', () => {
    let service: CompanyListenerService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CompanyListenerService,
                {
                    provide: PayrollCalculationService,
                    useValue: createMock<PayrollCalculationService>(),
                },
                {
                    provide: PayFundCalculationService,
                    useValue: createMock<PayFundCalculationService>(),
                },
                {
                    provide: PayPeriodsService,
                    useValue: createMock<PayPeriodsService>(),
                },
                {
                    provide: TaskGenerationService,
                    useValue: createMock<TaskGenerationService>(),
                },
            ],
        }).compile();

        service = module.get<CompanyListenerService>(CompanyListenerService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
