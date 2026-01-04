import { PayrollCalculationService } from '@/processor/payroll-calculation/payroll-calculation.service';
import { createMock } from '@golevelup/ts-jest';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from 'test';
import { UserRoleService } from '../user-role/user-role.service';
import { UserService } from '../user/user.service';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { CompanyEntity } from './entities/company.entity';

describe('CompanyController', () => {
    let controller: CompanyController;
    let service: CompanyService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CompanyController],
            providers: [
                CompanyService,
                { provide: getRepositoryToken(CompanyEntity), useFactory: repositoryMockFactory },
                { provide: UserService, useValue: createMock<UserService>() },
                { provide: UserRoleService, useValue: createMock<UserRoleService>() },
                { provide: EventEmitter2, useValue: createMock<EventEmitter2>() },
                {
                    provide: PayrollCalculationService,
                    useValue: createMock<PayrollCalculationService>(),
                },
            ],
        }).compile();

        controller = module.get<CompanyController>(CompanyController);
        service = module.get<CompanyService>(CompanyService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(service).toBeDefined();
    });
});
