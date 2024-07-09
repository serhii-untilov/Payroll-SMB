import { PayFundCalculationService } from '@/processor/payFundCalculation/payFundCalculation.service';
import { PaymentCalculationService } from '@/processor/paymentCalculation/payment-calculation.service';
import { PayrollCalculationService } from '@/processor/payrollCalculation/payrollCalculation.service';
import { SseService } from '@/processor/serverSentEvents/sse.service';
import { TaskGenerationService } from '@/processor/taskGeneration/taskGeneration.service';
import { PaymentEvent, PaymentEventType } from '@/resources/payments/events/abstract/PaymentEvent';
import { PaymentCreatedEvent } from '@/resources/payments/events/payment-created.event';
import { PaymentDeletedEvent } from '@/resources/payments/events/payment-deleted.event';
import { PaymentUpdatedEvent } from '@/resources/payments/events/payment-updated.event';
import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ServerEvent } from '@repo/shared';

@Injectable()
export class PaymentListenerService {
    private _logger: Logger = new Logger(PayrollCalculationService.name);

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
        this._logger.log(`handling ['payment.created'] ${JSON.stringify(event)}`);
        // this.runBatch(event);
    }

    @OnEvent('payment.updated')
    async handlePaymentUpdatedEvent(event: PaymentUpdatedEvent) {
        this._logger.log(`handling ['payment.updated'] ${JSON.stringify(event)}`);
        this.runBatch(event);
    }

    @OnEvent('payment.deleted')
    async handlePaymentDeletedEvent(event: PaymentDeletedEvent) {
        this._logger.log(`handling ['payment.deleted'] ${JSON.stringify(event)}`);
        // this.runBatch(event);
    }

    private async runBatch(event: PaymentEvent) {
        try {
            this.sseService.event(event.companyId, { data: ServerEvent.PAYROLL_STARTED });
            if (event.type !== PaymentEventType.DELETED) {
                await this.payrollCalculationService.calculateCompany(
                    event.userId,
                    event.companyId,
                );
                await this.payFundCalculationService.calculateCompany(
                    event.userId,
                    event.companyId,
                );
                // Recursion
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
            this.sseService.event(event.companyId, { data: ServerEvent.PAYROLL_FINISHED });
        } catch (_e) {
            this.sseService.event(event.companyId, { data: ServerEvent.PAYROLL_FAILED });
        }
    }
}
