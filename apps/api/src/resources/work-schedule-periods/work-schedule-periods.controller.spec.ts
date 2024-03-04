import { Test, TestingModule } from '@nestjs/testing';
import { WorkSchedulePeriodsController } from './work-schedule-periods.controller';
import { WorkSchedulePeriodsService } from './work-schedule-periods.service';

describe('WorkSchedulePeriodsController', () => {
    let controller: WorkSchedulePeriodsController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [WorkSchedulePeriodsController],
            providers: [WorkSchedulePeriodsService],
        }).compile();

        controller = module.get<WorkSchedulePeriodsController>(WorkSchedulePeriodsController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
