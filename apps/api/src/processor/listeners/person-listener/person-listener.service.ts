import { PayFundCalculationService } from '@/processor/pay-fund-calculation/pay-fund-calculation.service';
import { PayrollCalculationService } from '@/processor/payroll-calculation/payroll-calculation.service';
import { SseService } from '@/processor/server-sent-events/sse.service';
import { TaskGenerationService } from '@/processor/task-generation/task-generator.service';
import { PositionsService } from '@/resources';
import { PersonEvent } from '@/resources/person/events/base/person-event.abstract';
import { PersonCreatedEvent } from '@/resources/person/events/person-created.event';
import { PersonDeletedEvent } from '@/resources/person/events/person-deleted.event';
import { PersonUpdatedEvent } from '@/resources/person/events/person-updated.event';
import { ServerEvent } from '@/types';
import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class PersonListenerService {
    private _logger: Logger = new Logger(PersonListenerService.name);

    constructor(
        @Inject(forwardRef(() => PositionsService))
        private positionsService: PositionsService,
        @Inject(forwardRef(() => PayrollCalculationService))
        private payrollCalculationService: PayrollCalculationService,
        @Inject(forwardRef(() => PayFundCalculationService))
        private payFundCalculationService: PayFundCalculationService,
        @Inject(forwardRef(() => TaskGenerationService))
        private taskListService: TaskGenerationService,
        @Inject(forwardRef(() => SseService))
        private sseService: SseService,
    ) {}

    @OnEvent(PersonCreatedEvent.name)
    async handlePersonCreatedEvent(event: PersonCreatedEvent) {
        this._logger.log(`${JSON.stringify(event)}`);
        this.runBatch(event);
    }

    @OnEvent(PersonUpdatedEvent.name)
    async handlePersonUpdatedEvent(event: PersonUpdatedEvent) {
        this._logger.log(`${JSON.stringify(event)}`);
        this.runBatch(event);
    }

    @OnEvent(PersonDeletedEvent.name)
    async handlePersonDeletedEvent(event: PersonDeletedEvent) {
        this._logger.log(`${JSON.stringify(event)}`);
        this.runBatch(event);
    }

    private async runBatch(event: PersonEvent) {
        const positions = await this.positionsService.findMany({
            where: { personId: event.personId },
        });
        const companyIds = positions
            .map((o) => o.companyId)
            .filter((value, index, array) => array.indexOf(value) === index);
        for (const companyId of companyIds) {
            try {
                this.sseService.event(companyId, { data: ServerEvent.PayrollStarted });
                for (const position of positions.filter((o) => o.companyId === companyId)) {
                    await this.payrollCalculationService.calculatePosition(event.userId, position.id);
                    await this.payFundCalculationService.calculatePosition(event.userId, position.id);
                }
                await this.payrollCalculationService.calculateCompanyTotals(event.userId, companyId);
                await this.taskListService.generate(event.userId, companyId);
                this.sseService.event(companyId, { data: ServerEvent.PayrollFinished });
            } catch (e) {
                this._logger.fatal(`companyId ${companyId} ${ServerEvent.PayrollFailed} ${e}`);
                this.sseService.event(companyId, { data: ServerEvent.PayrollFailed });
            }
        }
    }
}
