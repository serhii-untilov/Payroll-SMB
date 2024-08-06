import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from 'test';
import { AccessService } from '../access/access.service';
import { Job } from './entities/job.entity';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';

describe('JobsController', () => {
    let controller: JobsController;
    let service: JobsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [JobsController],
            providers: [
                JobsService,
                {
                    provide: getRepositoryToken(Job),
                    useFactory: repositoryMockFactory,
                },
                { provide: AccessService, useValue: createMock<AccessService>() },
            ],
        }).compile();

        controller = module.get<JobsController>(JobsController);
        service = module.get<JobsService>(JobsService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(service).toBeDefined();
    });
});
