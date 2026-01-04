import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from 'test';
import { AccessService } from '../access/access.service';
import { WorkTimeNorm } from './entities/work-time-norm.entity';
import { WorkTimeNormController } from './work-time-norm.controller';
import { WorkTimeNormService } from './work-time-norm.service';

describe('WorkTimeNormController', () => {
    let controller: WorkTimeNormController;
    let service: WorkTimeNormService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [WorkTimeNormController],
            providers: [
                WorkTimeNormService,
                { provide: getRepositoryToken(WorkTimeNorm), useFactory: repositoryMockFactory },
                { provide: AccessService, useValue: createMock<AccessService>() },
            ],
        }).compile();

        controller = module.get<WorkTimeNormController>(WorkTimeNormController);
        service = module.get<WorkTimeNormService>(WorkTimeNormService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(service).toBeDefined();
    });
});
