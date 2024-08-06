import { createMock } from '@golevelup/ts-jest';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from 'test';
import { AccessService } from '../access/access.service';
import { DepartmentsController } from './departments.controller';
import { DepartmentsService } from './departments.service';
import { Department } from './entities/department.entity';

describe('DepartmentsController', () => {
    let controller: DepartmentsController;
    let service: DepartmentsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [DepartmentsController],
            providers: [
                DepartmentsService,
                { provide: getRepositoryToken(Department), useFactory: repositoryMockFactory },
                { provide: AccessService, useValue: createMock<AccessService>() },
                { provide: EventEmitter2, useValue: createMock<EventEmitter2>() },
            ],
        }).compile();

        controller = module.get<DepartmentsController>(DepartmentsController);
        service = module.get<DepartmentsService>(DepartmentsService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(service).toBeDefined();
    });
});
