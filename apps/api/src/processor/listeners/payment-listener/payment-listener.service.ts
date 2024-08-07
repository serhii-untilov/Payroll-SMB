import { PayFundCalculationService } from '@/processor/pay-fund-calculation/pay-fund-calculation.service';
import { PaymentCalculationService } from '@/processor/payment-calculation/payment-calculation.service';
import { PayrollCalculationService } from '@/processor/payroll-calculation/payroll-calculation.service';
import { SseService } from '@/processor/server-sent-events/sse.service';
import { TaskGenerationService } from '@/processor/task-generation/task-generator.service';
import {
    PaymentCreatedEvent,
    PaymentDeletedEvent,
    PaymentEvent,
    PaymentEventType,
    PaymentUpdatedEvent,
} from '@/resources';
import { ServerEvent } from '@/types';
import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class PaymentListenerService {
    private logger: Logger = new Logger(PaymentListenerService.name);
    private semaphore = 0;

    constructor(
        @Inject(forwardRef(() => PayrollCalculationService))
        private payrollCalculationService: PayrollCalculationService,
        @Inject(forwardRef(() => PaymentCalculationService))
        private paymentCalculationService: PaymentCalculationService,
        @Inject(forwardRef(() => PayFundCalculationService))
        private payFundCalculationService: PayFundCalculationService,
        @Inject(forwardRef(() => TaskGenerationService))
        private taskListService: TaskGenerationService,
        @Inject(forwardRef(() => SseService))
        private sseService: SseService,
    ) {}

    @OnEvent('payment.created')
    async handlePaymentCreatedEvent(event: PaymentCreatedEvent) {
        this.logger.log(`${JSON.stringify(event)}`);
        this.runBatch(event);
    }

    @OnEvent('payment.updated')
    async handlePaymentUpdatedEvent(event: PaymentUpdatedEvent) {
        this.logger.log(`${JSON.stringify(event)}`);
        this.runBatch(event);
    }

    @OnEvent('payment.deleted')
    async handlePaymentDeletedEvent(event: PaymentDeletedEvent) {
        this.logger.log(`${JSON.stringify(event)}`);
        this.runBatch(event);
    }

    private async runBatch(event: PaymentEvent) {
        if (this.semaphore) {
            this.logger.log(`Skip runBatch by semaphore.`);
            return;
        }
        this.semaphore++;
        try {
            this.sseService.event(event.companyId, { data: ServerEvent.PayrollStarted });
            if (event.type !== PaymentEventType.DELETED) {
                await this.payrollCalculationService.calculateCompany(
                    event.userId,
                    event.companyId,
                );
                await this.payFundCalculationService.calculateCompany(
                    event.userId,
                    event.companyId,
                );
                // To avoid recursion
                // await this.paymentCalculationService.calculateCompany(
                //     event.userId,
                //     event.companyId,
                // );
            }
            await this.payrollCalculationService.calculateCompanyTotals(
                event.userId,
                event.companyId,
            );
            await this.taskListService.generate(event.userId, event.companyId);
            this.sseService.event(event.companyId, { data: ServerEvent.PayrollFinished });
        } catch (e) {
            this.logger.fatal(`companyId ${event.companyId} ${ServerEvent.PayrollFailed} ${e}`);
            this.sseService.event(event.companyId, { data: ServerEvent.PayrollFailed });
        } finally {
            this.semaphore--;
        }
    }
}
