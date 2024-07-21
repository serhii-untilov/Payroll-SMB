import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from 'test';
import { AccessService } from '../access/access.service';
import { UserCompany } from './entities/user-company.entity';
import { UserCompaniesController } from './user-companies.controller';
import { UserCompaniesService } from './user-companies.service';

describe('UsersController', () => {
    let controller: UserCompaniesController;
    let service: UserCompaniesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserCompaniesController],
            providers: [
                UserCompaniesService,
                { provide: getRepositoryToken(UserCompany), useFactory: repositoryMockFactory },
                { provide: AccessService, useValue: createMock<AccessService>() },
            ],
        }).compile();

        controller = module.get<UserCompaniesController>(UserCompaniesController);
        service = module.get<UserCompaniesService>(UserCompaniesService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(service).toBeDefined();
    });
});
