import { Test, TestingModule } from '@nestjs/testing';
import { PositionListenerService } from './position-listener.service';
import { PayrollCalculationService } from '../../../processor/payrollCalculation/payrollCalculation.service';
import { createMock } from '@golevelup/ts-jest';

describe('PositionListenerService', () => {
    let service: PositionListenerService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PositionListenerService,
                {
                    provide: PayrollCalculationService,
                    useValue: createMock<PayrollCalculationService>(),
                },
            ],
        }).compile();

        service = module.get<PositionListenerService>(PositionListenerService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
