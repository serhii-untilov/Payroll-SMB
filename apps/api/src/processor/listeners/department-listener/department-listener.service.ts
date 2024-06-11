import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { DepartmentCreatedEvent } from '../../../resources/departments/events/department-created.event';
import { DepartmentDeletedEvent } from '../../../resources/departments/events/department-deleted.event';
import { DepartmentUpdatedEvent } from '../../../resources/departments/events/department-updated.event';
import { PayrollCalculationService } from '../../payrollCalculation/payrollCalculation.service';
import { TaskGenerationService } from '../../taskGeneration/taskGeneration.service';
import { SseService } from './../../serverSentEvents/sse.service';
import { ServerEvent } from '@repo/shared';

@Injectable()
export class DepartmentListenerService {
    private _logger: Logger = new Logger(PayrollCalculationService.name);

    constructor(
        @Inject(forwardRef(() => TaskGenerationService))
        private taskListService: TaskGenerationService,
        @Inject(forwardRef(() => SseService))
        private sseService: SseService,
    ) {}

    @OnEvent('department.created')
    async handleDepartmentCreatedEvent(event: DepartmentCreatedEvent) {
        this._logger.log(`handling ['department.created'] ${JSON.stringify(event)}`);
        this.runBatch(event.userId, event.companyId);
    }

    @OnEvent('department.updated')
    async handleDepartmentUpdatedEvent(event: DepartmentUpdatedEvent) {
        this._logger.log(`handling ['department.updated'] ${JSON.stringify(event)}`);
        this.runBatch(event.userId, event.companyId);
    }

    @OnEvent('department.deleted')
    async handleDepartmentDeletedEvent(event: DepartmentDeletedEvent) {
        this._logger.log(`handling ['department.deleted'] ${JSON.stringify(event)}`);
        this.runBatch(event.userId, event.companyId);
    }

    private async runBatch(userId: number, companyId: number) {
        try {
            this.sseService.event(companyId, { data: ServerEvent.TASKLIST_STARTED });
            await this.taskListService.generate(userId, companyId);
            this.sseService.event(companyId, { data: ServerEvent.TASKLIST_FINISHED });
        } catch (e) {
            this.sseService.event(companyId, { data: ServerEvent.TASKLIST_FAILED });
        }
    }
}
