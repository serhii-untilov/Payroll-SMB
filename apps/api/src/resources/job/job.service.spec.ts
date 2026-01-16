import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockType, repositoryMockFactory } from 'test';
import { Repository } from 'typeorm';
import { UserAccessService } from '../user-access/user-access.service';
import { JobEntity } from './entities/job.entity';
import { JobService } from './job.service';

describe('JobService', () => {
    let service: JobService;
    let repoMock: MockType<Repository<JobEntity>>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                JobService,
                { provide: getRepositoryToken(JobEntity), useFactory: repositoryMockFactory },
                { provide: UserAccessService, useValue: createMock<UserAccessService>() },
            ],
        }).compile();

        service = module.get<JobService>(JobService);
        repoMock = module.get(getRepositoryToken(JobEntity));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(repoMock).toBeDefined();
    });
});
