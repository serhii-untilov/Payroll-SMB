import { PayFundCalculationService } from '@/processor/pay-fund-calculation/pay-fund-calculation.service';
import { PaymentCalculationService } from '@/processor/payment-calculation/payment-calculation.service';
import { PayrollCalculationService } from '@/processor/payroll-calculation/payroll-calculation.service';
import { SseService } from '@/processor/server-sent-events/sse.service';
import { TaskGenerationService } from '@/processor/task-generation/task-generator.service';
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
