import { Test, TestingModule } from '@nestjs/testing';
import { WorkNormsController } from './work-norms.controller';
import { WorkNormsService } from './work-norms.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { WorkNorm } from './entities/work-norm.entity';
import { repositoryMockFactory } from '@repo/testing';
import { AccessService } from '../access/access.service';
import { createMock } from '@golevelup/ts-jest';

describe('WorkNormsController', () => {
    let controller: WorkNormsController;
    let service: WorkNormsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [WorkNormsController],
            providers: [
                WorkNormsService,
                { provide: getRepositoryToken(WorkNorm), useFactory: repositoryMockFactory },
                { provide: AccessService, useValue: createMock<AccessService>() },
            ],
        }).compile();

        controller = module.get<WorkNormsController>(WorkNormsController);
        service = module.get<WorkNormsService>(WorkNormsService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(service).toBeDefined();
    });
});
