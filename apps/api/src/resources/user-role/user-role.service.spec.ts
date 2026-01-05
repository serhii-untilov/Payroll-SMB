import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from 'test';
import { UserAccessService } from '../user-access/user-access.service';
import { UserRoleService } from './user-role.service';
import { UserRole } from './entities/user-role.entity';

describe('UserRoleService', () => {
    let service: UserRoleService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserRoleService,
                { provide: getRepositoryToken(UserRole), useFactory: repositoryMockFactory },
                { provide: UserAccessService, useValue: createMock<UserAccessService>() },
            ],
        }).compile();

        service = module.get<UserRoleService>(UserRoleService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
