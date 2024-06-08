import { Test, TestingModule } from '@nestjs/testing';
import { PersonListenerService } from './person-listener.service';
import { PayrollCalculationService } from '../../payrollCalculation/payrollCalculation.service';
import { createMock } from '@golevelup/ts-jest';
import { PayFundCalculationService } from '../../payFundCalculation/payFundCalculation.service';
import { TaskGenerationService } from '../../taskGeneration/taskGeneration.service';
import { PositionsService } from './../../../resources/positions/positions.service';

describe('PersonListenerService', () => {
    let service: PersonListenerService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PersonListenerService,
                {
                    provide: PositionsService,
                    useValue: createMock<PositionsService>(),
                },
                {
                    provide: PayrollCalculationService,
                    useValue: createMock<PayrollCalculationService>(),
                },
                {
                    provide: PayFundCalculationService,
                    useValue: createMock<PayFundCalculationService>(),
                },
                {
                    provide: TaskGenerationService,
                    useValue: createMock<TaskGenerationService>(),
                },
            ],
        }).compile();

        service = module.get<PersonListenerService>(PersonListenerService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
