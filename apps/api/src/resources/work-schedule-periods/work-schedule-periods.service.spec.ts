import { Test, TestingModule } from '@nestjs/testing';
import { WorkSchedulePeriodsService } from './work-schedule-periods.service';
import { MockType, repositoryMockFactory } from '@repo/utils';
import { Repository } from 'typeorm';
import { WorkSchedulePeriod } from './entities/work-schedule-period.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('WorkSchedulePeriodsService', () => {
    let service: WorkSchedulePeriodsService;
    let repoMock: MockType<Repository<WorkSchedulePeriod>>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                WorkSchedulePeriodsService,
                {
                    provide: getRepositoryToken(WorkSchedulePeriod),
                    useFactory: repositoryMockFactory,
                },
            ],
        }).compile();

        service = module.get<WorkSchedulePeriodsService>(WorkSchedulePeriodsService);
        repoMock = module.get(getRepositoryToken(WorkSchedulePeriod));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(repoMock).toBeTruthy();
    });
});
