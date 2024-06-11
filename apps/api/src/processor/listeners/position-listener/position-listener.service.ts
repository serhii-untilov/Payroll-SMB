import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PositionCreatedEvent } from '../../../resources/positions/events/position-created.event';
import { PayrollCalculationService } from './../../payrollCalculation/payrollCalculation.service';
import { PositionUpdatedEvent } from './../../../resources/positions/events/position-updated.event';
import { PayFundCalculationService } from './../../../processor/payFundCalculation/payFundCalculation.service';
import { PositionDeletedEvent } from './../../../resources/positions/events/position-deleted.event';
import { TaskGenerationService } from '../../taskGeneration/taskGeneration.service';
import { SseService } from './../../serverSentEvents/sse.service';
import {
    PositionEvent,
    PositionEventType,
} from './../../../resources/positions/events/abstract/PositionEvent';
import { ServerEvent } from '@repo/shared';

@Injectable()
export class PositionListenerService {
    private _logger: Logger = new Logger(PayrollCalculationService.name);

    constructor(
        @Inject(forwardRef(() => PayrollCalculationService))
        private payrollCalculationService: PayrollCalculationService,
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
            this.sseService.event(event.companyId, { data: ServerEvent.PAYROLL_STARTED });
            if (event.type !== PositionEventType.DELETED) {
                await this.payrollCalculationService.calculatePosition(
                    event.userId,
                    event.positionId,
                );
                await this.payFundCalculationService.calculatePosition(
                    event.userId,
                    event.positionId,
                );
            }
            await this.payrollCalculationService.calculateCompanyTotals(
                event.userId,
                event.companyId,
            );
            await this.taskListService.generate(event.userId, event.companyId);
            this.sseService.event(event.companyId, { data: ServerEvent.PAYROLL_FINISHED });
        } catch (e) {
            this.sseService.event(event.companyId, { data: ServerEvent.PAYROLL_FAILED });
        }
    }
}
