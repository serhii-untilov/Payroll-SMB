import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockType, repositoryMockFactory } from '@/test';
import { Repository } from 'typeorm';
import { UserAccessService } from '../user-access/user-access.service';
import { PayPeriodService } from '../pay-period/pay-period.service';
import { Task } from './entities/task.entity';
import { TasksService } from './tasks.service';

describe('TasksService', () => {
    let service: TasksService;
    let repoMock: MockType<Repository<Task>>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
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

        service = module.get<TasksService>(TasksService);
        repoMock = module.get(getRepositoryToken(Task));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(repoMock).toBeTruthy();
    });
});
