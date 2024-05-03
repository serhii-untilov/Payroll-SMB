import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockType, repositoryMockFactory } from '@repo/testing';
import { Repository } from 'typeorm';
import { AccessService } from './../access/access.service';
import { WorkNorm } from './entities/work-norm.entity';
import { WorkNormsService } from './work-norms.service';

describe('WorkNormsService', () => {
    let service: WorkNormsService;
    let repoMock: MockType<Repository<WorkNorm>>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                WorkNormsService,
                { provide: getRepositoryToken(WorkNorm), useFactory: repositoryMockFactory },
                { provide: AccessService, useValue: createMock<AccessService>() },
            ],
        }).compile();

        service = module.get<WorkNormsService>(WorkNormsService);
        repoMock = module.get(getRepositoryToken(WorkNorm));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(repoMock).toBeTruthy();
    });
});
