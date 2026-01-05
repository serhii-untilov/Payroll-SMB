import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from 'test';
import { UserAccessService } from '../user-access/user-access.service';
import { UserRole } from './entities/user-role.entity';
import { UserRoleController } from './user-role.controller';
import { UserRoleService } from './user-role.service';

describe('UserRoleController', () => {
    let controller: UserRoleController;
    let service: UserRoleService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserRoleController],
            providers: [
                UserRoleService,
                { provide: getRepositoryToken(UserRole), useFactory: repositoryMockFactory },
                { provide: UserAccessService, useValue: createMock<UserAccessService>() },
            ],
        }).compile();

        controller = module.get<UserRoleController>(UserRoleController);
        service = module.get<UserRoleService>(UserRoleService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(service).toBeDefined();
    });
});
