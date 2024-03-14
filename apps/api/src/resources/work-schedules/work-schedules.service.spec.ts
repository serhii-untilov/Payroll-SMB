import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockType, repositoryMockFactory } from '@repo/testing';
import { Repository } from 'typeorm';
import { WorkSchedule } from './entities/work-schedule.entity';
import { WorkSchedulesService } from './work-schedules.service';

describe('WorkSchedulesService', () => {
    let service: WorkSchedulesService;
    let repoMock: MockType<Repository<WorkSchedule>>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                WorkSchedulesService,
                {
                    provide: getRepositoryToken(WorkSchedule),
                    useFactory: repositoryMockFactory,
                },
            ],
        }).compile();

        service = module.get<WorkSchedulesService>(WorkSchedulesService);
        repoMock = module.get(getRepositoryToken(WorkSchedule));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(repoMock).toBeTruthy();
    });
});
