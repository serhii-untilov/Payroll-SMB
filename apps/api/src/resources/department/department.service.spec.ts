import { createMock } from '@golevelup/ts-jest';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockType, repositoryMockFactory } from 'test';
import { Repository } from 'typeorm';
import { UserAccessService } from '../user-access/user-access.service';
import { DepartmentService } from './department.service';
import { DepartmentEntity } from './entities/department.entity';

describe('DepartmentService', () => {
    let service: DepartmentService;
    let repoMock: MockType<Repository<DepartmentEntity>>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DepartmentService,
                { provide: getRepositoryToken(DepartmentEntity), useFactory: repositoryMockFactory },
                { provide: UserAccessService, useValue: createMock<UserAccessService>() },
                { provide: EventEmitter2, useValue: createMock<EventEmitter2>() },
            ],
        }).compile();

        service = module.get<DepartmentService>(DepartmentService);
        repoMock = module.get(getRepositoryToken(DepartmentEntity));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(repoMock).toBeTruthy();
    });
});
