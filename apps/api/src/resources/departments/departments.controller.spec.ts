import { createMock } from '@golevelup/ts-jest';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from 'test';
import { UserAccessService } from '../user-access/user-access.service';
import { DepartmentsController } from './departments.controller';
import { DepartmentsService } from './department.service';
import { DepartmentEntity } from './entities/department.entity';

describe('DepartmentsController', () => {
    let controller: DepartmentsController;
    let service: DepartmentsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [DepartmentsController],
            providers: [
                DepartmentsService,
                { provide: getRepositoryToken(DepartmentEntity), useFactory: repositoryMockFactory },
                { provide: UserAccessService, useValue: createMock<UserAccessService>() },
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
