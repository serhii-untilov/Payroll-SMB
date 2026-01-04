import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from 'test';
import { AccessService } from '../access/access.service';
import { UserRoleService } from './user-role.service';
import { UserRole } from './entities/user-role.entity';

describe('UserRoleService', () => {
    let service: UserRoleService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserRoleService,
                { provide: getRepositoryToken(UserRole), useFactory: repositoryMockFactory },
                { provide: AccessService, useValue: createMock<AccessService>() },
            ],
        }).compile();

        service = module.get<UserRoleService>(UserRoleService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
