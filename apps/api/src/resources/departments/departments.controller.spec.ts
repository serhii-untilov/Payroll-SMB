import { Test, TestingModule } from '@nestjs/testing';
import { DepartmentsController } from './departments.controller';
import { DepartmentsService } from './departments.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Department } from './entities/department.entity';
import { repositoryMockFactory } from '@repo/utils';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

describe('DepartmentsController', () => {
    let controller: DepartmentsController;
    let service: DepartmentsService;
    let usersService: UsersService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [DepartmentsController],
            providers: [
                DepartmentsService,
                UsersService,
                {
                    provide: getRepositoryToken(Department),
                    useFactory: repositoryMockFactory,
                },
                {
                    provide: getRepositoryToken(User),
                    useFactory: repositoryMockFactory,
                },
            ],
        }).compile();

        controller = module.get<DepartmentsController>(DepartmentsController);
        service = module.get<DepartmentsService>(DepartmentsService);
        usersService = module.get<UsersService>(UsersService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(service).toBeDefined();
        expect(usersService).toBeDefined();
    });
});
