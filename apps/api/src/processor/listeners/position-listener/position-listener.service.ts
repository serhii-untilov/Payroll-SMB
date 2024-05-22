import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PositionCreatedEvent } from 'src/resources/positions/events/position-created.event';
import { PayrollCalculationService } from './../../payrollCalculation/payrollCalculation.service';

@Injectable()
export class PositionListenerService {
    private _logger: Logger = new Logger(PayrollCalculationService.name);

    constructor(
        @Inject(forwardRef(() => PayrollCalculationService))
        private payrollCalculationService: PayrollCalculationService,
    ) {}

    @OnEvent('position.updated')
    async handlePositionUpdatedEvent(event: PositionCreatedEvent) {
        this._logger.log(`handling ['position.updated'] ${JSON.stringify(event)}`);
        await this.payrollCalculationService.calculatePosition(event.userId, event.positionId);
        await this.payrollCalculationService.calculateCompanyTotals(event.userId, event.companyId);
    }
}
