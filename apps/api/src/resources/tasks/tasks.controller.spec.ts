import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { repositoryMockFactory } from '@/test';
import { UserAccessService } from '../user-access/user-access.service';
import { PayPeriodService } from '../pay-period/pay-period.service';
import { createMock } from '@golevelup/ts-jest';

describe('TasksController', () => {
    let controller: TasksController;
    let service: TasksService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TasksController],
            providers: [
                TasksService,
                {
                    provide: getRepositoryToken(Task),
                    useFactory: repositoryMockFactory,
                },
                { provide: UserAccessService, useValue: createMock<UserAccessService>() },
                { provide: PayPeriodService, useValue: createMock<PayPeriodService>() },
            ],
        }).compile();

        controller = module.get<TasksController>(TasksController);
        service = module.get<TasksService>(TasksService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(service).toBeDefined();
    });
});
