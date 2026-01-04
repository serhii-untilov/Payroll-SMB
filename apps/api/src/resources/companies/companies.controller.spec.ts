import { PayrollCalculationService } from '@/processor/payroll-calculation/payroll-calculation.service';
import { createMock } from '@golevelup/ts-jest';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from 'test';
import { AccessService } from '../access/access.service';
import { UserRoleService } from '../user-role/user-role.service';
import { UserService } from '../users/users.service';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { Company } from './entities/company.entity';

describe('CompaniesController', () => {
    let controller: CompaniesController;
    let service: CompaniesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CompaniesController],
            providers: [
                CompaniesService,
                { provide: getRepositoryToken(Company), useFactory: repositoryMockFactory },
                { provide: UserService, useValue: createMock<UserService>() },
                { provide: UserRoleService, useValue: createMock<UserRoleService>() },
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
