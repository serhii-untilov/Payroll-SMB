import { PayrollCalculationService } from './../../processor/payrollCalculation/payrollCalculation.service';
import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from '@repo/testing';
import { AccessService } from '../access/access.service';
import { UsersCompanyService } from '../users/users-company.service';
import { UsersService } from '../users/users.service';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { Company } from './entities/company.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('CompaniesController', () => {
    let controller: CompaniesController;
    let service: CompaniesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CompaniesController],
            providers: [
                CompaniesService,
                { provide: getRepositoryToken(Company), useFactory: repositoryMockFactory },
                { provide: UsersService, useValue: createMock<UsersService>() },
                { provide: UsersCompanyService, useValue: createMock<UsersCompanyService>() },
                { provide: AccessService, useValue: createMock<AccessService>() },
                { provide: EventEmitter2, useValue: createMock<EventEmitter2>() },
                {
                    provide: PayrollCalculationService,
                    useValue: createMock<PayrollCalculationService>(),
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
