import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockType, repositoryMockFactory } from '@repo/testing';
import { Repository } from 'typeorm';
import { DepartmentsService } from './departments.service';
import { Department } from './entities/department.entity';
import { User } from '../users/entities/user.entity';
import { Company } from '../companies/entities/company.entity';

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
                {
                    provide: getRepositoryToken(User),
                    useFactory: repositoryMockFactory,
                },
                {
                    provide: getRepositoryToken(Company),
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
