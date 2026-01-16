import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from 'test';
import { UserAccessService } from '../user-access/user-access.service';
import { JobEntity } from './entities/job.entity';
import { JobController } from './job.controller';
import { JobService } from './job.service';

describe('JobController', () => {
    let controller: JobController;
    let service: JobService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [JobController],
            providers: [
                JobService,
                {
                    provide: getRepositoryToken(JobEntity),
                    useFactory: repositoryMockFactory,
                },
                { provide: UserAccessService, useValue: createMock<UserAccessService>() },
            ],
        }).compile();

        controller = module.get<JobController>(JobController);
        service = module.get<JobService>(JobService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(service).toBeDefined();
    });
});
