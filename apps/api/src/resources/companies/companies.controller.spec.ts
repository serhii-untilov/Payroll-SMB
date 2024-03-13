import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from '@repo/testing';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { Company } from './entities/company.entity';
import { UserCompany } from '../users/entities/user-company.entity';
import { User } from '../users/entities/user.entity';

describe('CompaniesController', () => {
    let controller: CompaniesController;
    let service: CompaniesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CompaniesController],
            providers: [
                CompaniesService,
                {
                    provide: getRepositoryToken(Company),
                    useFactory: repositoryMockFactory,
                },
                {
                    provide: getRepositoryToken(UserCompany),
                    useFactory: repositoryMockFactory,
                },
                {
                    provide: getRepositoryToken(User),
                    useFactory: repositoryMockFactory,
                },
            ],
        }).compile();

        controller = module.get<CompaniesController>(CompaniesController);
        service = module.get<CompaniesService>(CompaniesService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(service).toBeDefined();
    });
});
