import { PayFundCalculationService } from '@/processor/payFundCalculation/payFundCalculation.service';
import { PayrollCalculationService } from '@/processor/payrollCalculation/payrollCalculation.service';
import { SseService } from '@/processor/serverSentEvents/sse.service';
import { TaskGenerationService } from '@/processor/taskGeneration/taskGeneration.service';
import { PositionsService } from '@/resources/positions/positions.service';
import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { PersonListenerService } from './person-listener.service';

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
                {
                    provide: SseService,
                    useValue: createMock<SseService>(),
                },
            ],
        }).compile();

        service = module.get<PersonListenerService>(PersonListenerService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
