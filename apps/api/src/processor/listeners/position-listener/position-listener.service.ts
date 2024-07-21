import { PayFundCalculationService } from '@/processor/pay-fund-calculation/pay-fund-calculation.service';
import { PaymentCalculationService } from '@/processor/payment-calculation/payment-calculation.service';
import { PayrollCalculationService } from '@/processor/payroll-calculation/payroll-calculation.service';
import { SseService } from '@/processor/server-sent-events/sse.service';
import { TaskGenerationService } from '@/processor/task-generation/task-generator.service';
import {
    PositionCreatedEvent,
    PositionDeletedEvent,
    PositionEvent,
    PositionEventType,
    PositionUpdatedEvent,
} from '@/resources';
import { ServerEvent } from '@repo/shared';
import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class PositionListenerService {
    private _logger: Logger = new Logger(PositionListenerService.name);

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

    @OnEvent('position.created')
    async handlePositionCreatedEvent(event: PositionCreatedEvent) {
        this._logger.log(`handling ['position.created'] ${JSON.stringify(event)}`);
        this.runBatch(event);
    }

    @OnEvent('position.updated')
    async handlePositionUpdatedEvent(event: PositionUpdatedEvent) {
        this._logger.log(`handling ['position.updated'] ${JSON.stringify(event)}`);
        this.runBatch(event);
    }

    @OnEvent('position.deleted')
    async handlePositionDeletedEvent(event: PositionDeletedEvent) {
        this._logger.log(`handling ['position.deleted'] ${JSON.stringify(event)}`);
        this.runBatch(event);
    }

    private async runBatch(event: PositionEvent) {
        try {
            this.sseService.event(event.companyId, { data: ServerEvent.PayrollStarted });
            if (event.type !== PositionEventType.DELETED) {
                await this.payrollCalculationService.calculatePosition(
                    event.userId,
                    event.positionId,
                );
                await this.payFundCalculationService.calculatePosition(
                    event.userId,
                    event.positionId,
                );
                await this.paymentCalculationService.calculatePosition(
                    event.userId,
                    event.positionId,
                );
            }
            await this.payrollCalculationService.calculateCompanyTotals(
                event.userId,
                event.companyId,
            );
            await this.taskListService.generate(event.userId, event.companyId);
            this.sseService.event(event.companyId, { data: ServerEvent.PayrollFinished });
        } catch (e) {
            this._logger.fatal(`companyId ${event.companyId} ${ServerEvent.PayrollFailed} ${e}`);
            this.sseService.event(event.companyId, { data: ServerEvent.PayrollFailed });
        }
    }
}
