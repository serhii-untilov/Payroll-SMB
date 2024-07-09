import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockType, repositoryMockFactory } from '@repo/testing';
import { Repository } from 'typeorm';
import { AccessService } from '../access/access.service';
import { Job } from './entities/job.entity';
import { JobsService } from './jobs.service';

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
