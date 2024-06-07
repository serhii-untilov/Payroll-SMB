import { Test, TestingModule } from '@nestjs/testing';
import { PersonListenerService } from './person-listener.service';
import { PayrollCalculationService } from '../../payrollCalculation/payrollCalculation.service';
import { createMock } from '@golevelup/ts-jest';
import { PayFundCalculationService } from '../../payFundCalculation/payFundCalculation.service';
import { TaskListService } from '../../task-list/task-list.service';
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
                    provide: TaskListService,
                    useValue: createMock<TaskListService>(),
                },
            ],
        }).compile();

        service = module.get<PersonListenerService>(PersonListenerService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
