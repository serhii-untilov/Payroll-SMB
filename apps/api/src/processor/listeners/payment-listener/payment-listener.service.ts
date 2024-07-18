import { PayFundCalculationService } from '@/processor/payFundCalculation/payFundCalculation.service';
import { PaymentCalculationService } from '@/processor/paymentCalculation/payment-calculation.service';
import { PayrollCalculationService } from '@/processor/payroll-calculation/payrollCalculation.service';
import { SseService } from '@/processor/server-sent-events/sse.service';
import { TaskGenerationService } from '@/processor/task-generation/taskGeneration.service';
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
    private _logger: Logger = new Logger(PaymentListenerService.name);

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
        } catch (e) {
            this._logger.fatal(`companyId ${event.companyId} ${ServerEvent.PAYROLL_FAILED} ${e}`);
            this.sseService.event(event.companyId, { data: ServerEvent.PAYROLL_FAILED });
        }
    }
}
