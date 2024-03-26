import { Test, TestingModule } from '@nestjs/testing';
import { WorkNormsController } from './work-schedules.controller';
import { WorkNormsService } from './work-schedules.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { WorkNorm } from './entities/work-schedule.entity';
import { repositoryMockFactory } from '@repo/testing';

describe('WorkNormsController', () => {
    let controller: WorkNormsController;
    let service: WorkNormsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [WorkNormsController],
            providers: [
                WorkNormsService,
                {
                    provide: getRepositoryToken(WorkNorm),
                    useFactory: repositoryMockFactory,
                },
            ],
        }).compile();

        controller = module.get<WorkNormsController>(WorkNormsController);
        service = module.get<WorkNormsService>(WorkNormsService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(service).toBeDefined();
    });
});
