import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from 'test';
import { AccessService } from '../access/access.service';
import { UserCompaniesService } from '../user-companies/user-companies.service';
import { UserCompany } from './entities/user-company.entity';

describe('UserCompaniesService', () => {
    let service: UserCompaniesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserCompaniesService,
                { provide: getRepositoryToken(UserCompany), useFactory: repositoryMockFactory },
                { provide: AccessService, useValue: createMock<AccessService>() },
            ],
        }).compile();

        service = module.get<UserCompaniesService>(UserCompaniesService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
