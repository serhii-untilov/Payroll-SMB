import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from '@repo/utils';
import { WorkSchedulePeriod } from './entities/work-schedule-period.entity';
import { WorkSchedulePeriodsController } from './work-schedule-periods.controller';
import { WorkSchedulePeriodsService } from './work-schedule-periods.service';

describe('WorkSchedulePeriodsController', () => {
    let controller: WorkSchedulePeriodsController;
    let service: WorkSchedulePeriodsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [WorkSchedulePeriodsController],
            providers: [
                WorkSchedulePeriodsService,
                {
                    provide: getRepositoryToken(WorkSchedulePeriod),
                    useFactory: repositoryMockFactory,
                },
            ],
        }).compile();

        controller = module.get<WorkSchedulePeriodsController>(WorkSchedulePeriodsController);
        service = module.get<WorkSchedulePeriodsService>(WorkSchedulePeriodsService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(service).toBeDefined();
    });
});
