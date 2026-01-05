import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from 'test';
import { UserAccessService } from '../user-access/user-access.service';
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
                { provide: UserAccessService, useValue: createMock<UserAccessService>() },
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
