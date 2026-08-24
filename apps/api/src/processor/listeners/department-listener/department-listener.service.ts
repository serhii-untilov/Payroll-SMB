import { SseService } from '@/processor/server-sent-events/sse.service';
import { TaskGenerationService } from '@/processor/task-generation/task-generator.service';
import { ServerEvent } from '@/types';
import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { DepartmentCreatedEvent } from '../../../resources/department/events/department-created.event';
import { DepartmentDeletedEvent } from '../../../resources/department/events/department-deleted.event';
import { DepartmentUpdatedEvent } from '../../../resources/department/events/department-updated.event';

@Injectable()
export class DepartmentListenerService {
    private readonly logger: Logger = new Logger(DepartmentListenerService.name);

    constructor(
        @Inject(forwardRef(() => TaskGenerationService))
        private taskListService: TaskGenerationService,
        @Inject(forwardRef(() => SseService))
        private sseService: SseService,
    ) {}

    @OnEvent(DepartmentCreatedEvent.name)
    async handleDepartmentCreatedEvent(event: DepartmentCreatedEvent) {
        this.logger.log(`${JSON.stringify(event)}`);
        this.runBatch(event.userId, event.departmentId);
    }

    @OnEvent(DepartmentUpdatedEvent.name)
    async handleDepartmentUpdatedEvent(event: DepartmentUpdatedEvent) {
        this.logger.log(`${JSON.stringify(event)}`);
        this.runBatch(event.userId, event.departmentId);
    }

    @OnEvent(DepartmentDeletedEvent.name)
    async handleDepartmentDeletedEvent(event: DepartmentDeletedEvent) {
        this.logger.log(`${JSON.stringify(event)}`);
        this.runBatch(event.userId, event.departmentId);
    }

    private async runBatch(userId: string, departmentId: string) {
        try {
            this.sseService.event(departmentId, { data: ServerEvent.TasklistStarted });
            await this.taskListService.generate(userId, departmentId);
            this.sseService.event(departmentId, { data: ServerEvent.TasklistFinished });
        } catch (e) {
            this.logger.fatal(`departmentId ${departmentId} ${ServerEvent.TasklistFailed} ${e}`);
            this.sseService.event(departmentId, { data: ServerEvent.TasklistFailed });
        }
    }
}
