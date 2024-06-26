import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ServerEvent } from '@repo/shared';
import { PersonCreatedEvent } from '../../../resources/persons/events/person-created.event';
import { PersonDeletedEvent } from '../../../resources/persons/events/person-deleted.event';
import { PersonUpdatedEvent } from '../../../resources/persons/events/person-updated.event';
import { PayFundCalculationService } from '../../payFundCalculation/payFundCalculation.service';
import { PayrollCalculationService } from '../../payrollCalculation/payrollCalculation.service';
import { TaskGenerationService } from '../../taskGeneration/taskGeneration.service';
import { PersonEvent } from './../../../resources/persons/events/abstract/PersonEvent';
import { PositionsService } from './../../../resources/positions/positions.service';
import { SseService } from './../../serverSentEvents/sse.service';

@Injectable()
export class PersonListenerService {
    private _logger: Logger = new Logger(PayrollCalculationService.name);

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

    @OnEvent('person.created')
    async handlePersonCreatedEvent(event: PersonCreatedEvent) {
        this._logger.log(`handling ['person.created'] ${JSON.stringify(event)}`);
        this.runBatch(event);
    }

    @OnEvent('person.updated')
    async handlePersonUpdatedEvent(event: PersonUpdatedEvent) {
        this._logger.log(`handling ['person.updated'] ${JSON.stringify(event)}`);
        this.runBatch(event);
    }

    @OnEvent('person.deleted')
    async handlePersonDeletedEvent(event: PersonDeletedEvent) {
        this._logger.log(`handling ['person.deleted'] ${JSON.stringify(event)}`);
        this.runBatch(event);
    }

    private async runBatch(event: PersonEvent) {
        const positions = await this.positionsService.findMany({
            where: { personId: event.id },
        });
        const companyIds = positions
            .map((o) => o.companyId)
            .filter((value, index, array) => array.indexOf(value) === index);
        for (const companyId of companyIds) {
            try {
                this.sseService.event(companyId, { data: ServerEvent.PAYROLL_STARTED });
                for (const position of positions.filter((o) => o.companyId === companyId)) {
                    await this.payrollCalculationService.calculatePosition(
                        event.userId,
                        position.id,
                    );
                    await this.payFundCalculationService.calculatePosition(
                        event.userId,
                        position.id,
                    );
                }
                await this.payrollCalculationService.calculateCompanyTotals(
                    event.userId,
                    companyId,
                );
                await this.taskListService.generate(event.userId, companyId);
                this.sseService.event(companyId, { data: ServerEvent.PAYROLL_FINISHED });
            } catch (e) {
                this.sseService.event(companyId, { data: ServerEvent.PAYROLL_FAILED });
            }
        }
    }
}
