import { SseService } from '@/processor/server-sent-events/sse.service';
import { TaskGenerationService } from '@/processor/task-generation/taskGeneration.service';
import {
    DepartmentCreatedEvent,
    DepartmentDeletedEvent,
    DepartmentUpdatedEvent,
} from '@/resources';
import { ServerEvent } from '@/types';
import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class DepartmentListenerService {
    private _logger: Logger = new Logger(DepartmentListenerService.name);

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
            this._logger.fatal(`companyId ${companyId} ${ServerEvent.TASKLIST_FAILED} ${e}`);
            this.sseService.event(companyId, { data: ServerEvent.TASKLIST_FAILED });
        }
    }
}
