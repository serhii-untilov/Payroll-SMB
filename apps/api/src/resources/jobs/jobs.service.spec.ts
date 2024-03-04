import { Test, TestingModule } from '@nestjs/testing';
import { JobsService } from './jobs.service';
import { MockType, repositoryMockFactory } from '@repo/utils';
import { Repository } from 'typeorm';
import { Job } from './entities/job.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('JobsService', () => {
    let service: JobsService;
    let repoMock: MockType<Repository<Job>>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                JobsService,
                {
                    provide: getRepositoryToken(Job),
                    useFactory: repositoryMockFactory,
                },
            ],
        }).compile();

        service = module.get<JobsService>(JobsService);
        repoMock = module.get(getRepositoryToken(Job));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(repoMock).toBeTruthy();
    });
});
