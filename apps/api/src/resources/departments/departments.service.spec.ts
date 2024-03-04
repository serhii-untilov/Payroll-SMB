import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockType, repositoryMockFactory } from '@repo/utils';
import { Repository } from 'typeorm';
import { DepartmentsService } from './departments.service';
import { Department } from './entities/department.entity';

describe('DepartmentsService', () => {
    let service: DepartmentsService;
    let repoMock: MockType<Repository<Department>>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DepartmentsService,
                {
                    provide: getRepositoryToken(Department),
                    useFactory: repositoryMockFactory,
                },
            ],
        }).compile();

        service = module.get<DepartmentsService>(DepartmentsService);
        repoMock = module.get(getRepositoryToken(Department));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(repoMock).toBeTruthy();
    });
});
