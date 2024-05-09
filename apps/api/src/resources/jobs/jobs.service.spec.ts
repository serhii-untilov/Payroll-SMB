import { Test, TestingModule } from '@nestjs/testing';
import { JobsService } from './jobs.service';
import { MockType, repositoryMockFactory } from '@repo/testing';
import { Repository } from 'typeorm';
import { Job } from './entities/job.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AccessService } from '../access/access.service';
import { createMock } from '@golevelup/ts-jest';

describe('JobsService', () => {
    let service: JobsService;
    let repoMock: MockType<Repository<Job>>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                JobsService,
                { provide: getRepositoryToken(Job), useFactory: repositoryMockFactory },
                { provide: AccessService, useValue: createMock<AccessService>() },
            ],
        }).compile();

        service = module.get<JobsService>(JobsService);
        repoMock = module.get(getRepositoryToken(Job));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(repoMock).toBeDefined();
    });
});
