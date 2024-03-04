import { Test, TestingModule } from '@nestjs/testing';
import { WorkSchedulesController } from './work-schedules.controller';
import { WorkSchedulesService } from './work-schedules.service';

describe('WorkSchedulesController', () => {
    let controller: WorkSchedulesController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [WorkSchedulesController],
            providers: [WorkSchedulesService],
        }).compile();

        controller = module.get<WorkSchedulesController>(WorkSchedulesController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
