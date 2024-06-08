import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PersonCreatedEvent } from '../../../resources/persons/events/person-created.event';
import { PayrollCalculationService } from '../../payrollCalculation/payrollCalculation.service';
import { PersonUpdatedEvent } from '../../../resources/persons/events/person-updated.event';
import { PayFundCalculationService } from '../../payFundCalculation/payFundCalculation.service';
import { PersonDeletedEvent } from '../../../resources/persons/events/person-deleted.event';
import { TaskGenerationService } from '../../taskGeneration/taskGeneration.service';
import { PositionsService } from './../../../resources/positions/positions.service';

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
    ) {}

    @OnEvent('person.created')
    async handlePersonCreatedEvent(event: PersonCreatedEvent) {
        this._logger.log(`handling ['person.created'] ${JSON.stringify(event)}`);
        const positions = await this.positionsService.findMany({ where: { personId: event.id } });
        const companyIds = positions
            .map((o) => o.companyId)
            .filter((value, index, array) => array.indexOf(value) === index);
        for (const companyId of companyIds) {
            await this.taskListService.generate(event.userId, companyId);
        }
    }

    @OnEvent('person.updated')
    async handlePersonUpdatedEvent(event: PersonUpdatedEvent) {
        this._logger.log(`handling ['person.updated'] ${JSON.stringify(event)}`);
        const positions = await this.positionsService.findMany({ where: { personId: event.id } });
        const companyIds = positions
            .map((o) => o.companyId)
            .filter((value, index, array) => array.indexOf(value) === index);
        for (const position of positions) {
            await this.payrollCalculationService.calculatePosition(event.userId, position.id);
            await this.payFundCalculationService.calculatePosition(event.userId, position.id);
        }
        for (const companyId of companyIds) {
            await this.payrollCalculationService.calculateCompanyTotals(event.userId, companyId);
            await this.taskListService.generate(event.userId, companyId);
        }
    }

    @OnEvent('person.deleted')
    async handlePersonDeletedEvent(event: PersonDeletedEvent) {
        this._logger.log(`handling ['person.deleted'] ${JSON.stringify(event)}`);
        const positions = await this.positionsService.findMany({ where: { personId: event.id } });
        const companyIds = positions
            .map((o) => o.companyId)
            .filter((value, index, array) => array.indexOf(value) === index);
        for (const companyId of companyIds) {
            await this.payrollCalculationService.calculateCompanyTotals(event.userId, companyId);
            await this.taskListService.generate(event.userId, companyId);
        }
    }
}
