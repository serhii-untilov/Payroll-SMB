import { Test, TestingModule } from '@nestjs/testing';
import { WorkSchedulePeriodsService } from './work-schedule-periods.service';

describe('WorkSchedulePeriodsService', () => {
    let service: WorkSchedulePeriodsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [WorkSchedulePeriodsService],
        }).compile();

        service = module.get<WorkSchedulePeriodsService>(WorkSchedulePeriodsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
