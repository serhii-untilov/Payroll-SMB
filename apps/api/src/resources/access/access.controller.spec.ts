import { Test, TestingModule } from '@nestjs/testing';
import { AccessController } from './access.controller';
import { AccessService } from './access.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Access } from './entities/access.entity';
import { repositoryMockFactory } from '@repo/testing';
import { UsersService } from '../users/users.service';
import { createMock } from '@golevelup/ts-jest';
import { UsersCompanyService } from '../users/users-company.service';

describe('AccessController', () => {
    let controller: AccessController;
    let service: AccessService;
    let usersService: UsersService;
    let usersCompanyService: UsersCompanyService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AccessController],
            providers: [
                AccessService,
                {
                    provide: getRepositoryToken(Access),
                    useFactory: repositoryMockFactory,
                },
                { provide: UsersService, useValue: createMock<UsersService>() },
                { provide: UsersCompanyService, useValue: createMock<UsersCompanyService>() },
            ],
        }).compile();

        controller = module.get<AccessController>(AccessController);
        service = module.get<AccessService>(AccessService);
        usersService = module.get<UsersService>(UsersService);
        usersCompanyService = module.get<UsersCompanyService>(UsersCompanyService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(service).toBeDefined();
        expect(usersService).toBeDefined();
        expect(usersCompanyService).toBeDefined();
    });
});
