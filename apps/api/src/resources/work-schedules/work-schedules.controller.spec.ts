import { Test, TestingModule } from '@nestjs/testing';
import { WorkSchedulesController } from './work-schedules.controller';
import { WorkSchedulesService } from './work-schedules.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { WorkSchedule } from './entities/work-schedule.entity';
import { repositoryMockFactory } from '@repo/utils';

describe('WorkSchedulesController', () => {
    let controller: WorkSchedulesController;
    let service: WorkSchedulesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [WorkSchedulesController],
            providers: [
                WorkSchedulesService,
                {
                    provide: getRepositoryToken(WorkSchedule),
                    useFactory: repositoryMockFactory,
                },
            ],
        }).compile();

        controller = module.get<WorkSchedulesController>(WorkSchedulesController);
        service = module.get<WorkSchedulesService>(WorkSchedulesService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(service).toBeDefined();
    });
});
