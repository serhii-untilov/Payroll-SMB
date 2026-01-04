import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockType, repositoryMockFactory } from 'test';
import { Repository } from 'typeorm';
import { AccessService } from '../access/access.service';
import { WorkTimeNorm } from './entities/work-time-norm.entity';
import { WorkTimeNormService } from './work-time-norm.service';

describe('WorkTimeNormsService', () => {
    let service: WorkTimeNormService;
    let repoMock: MockType<Repository<WorkTimeNorm>>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                WorkTimeNormService,
                { provide: getRepositoryToken(WorkTimeNorm), useFactory: repositoryMockFactory },
                { provide: AccessService, useValue: createMock<AccessService>() },
            ],
        }).compile();

        service = module.get<WorkTimeNormService>(WorkTimeNormService);
        repoMock = module.get(getRepositoryToken(WorkTimeNorm));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(repoMock).toBeTruthy();
    });
});
