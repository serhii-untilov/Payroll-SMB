import { PayFundCalculationService } from '@/processor/payFundCalculation/payFundCalculation.service';
import { PaymentCalculationService } from '@/processor/paymentCalculation/payment-calculation.service';
import { PayrollCalculationService } from '@/processor/payrollCalculation/payrollCalculation.service';
import { SseService } from '@/processor/serverSentEvents/sse.service';
import { TaskGenerationService } from '@/processor/taskGeneration/taskGeneration.service';
import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { PaymentListenerService } from './payment-listener.service';

describe('PaymentListenerService', () => {
    let service: PaymentListenerService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PaymentListenerService,
                {
                    provide: PayrollCalculationService,
                    useValue: createMock<PayrollCalculationService>(),
                },
                {
                    provide: PaymentCalculationService,
                    useValue: createMock<PaymentCalculationService>(),
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

        service = module.get<PaymentListenerService>(PaymentListenerService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
