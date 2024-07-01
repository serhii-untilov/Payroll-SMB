import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { CompaniesService } from '../../resources/companies/companies.service';
import { PayPeriodsService } from '../../resources/pay-periods/payPeriods.service';
import { TasksService } from '../../resources/tasks/tasks.service';
import { TaskGenerationService } from './taskGeneration.service';
import { DepartmentsService } from '../../resources/departments/departments.service';
import { PositionsService } from '../../resources/positions/positions.service';
import { PersonsService } from '../../resources/persons/persons.service';
import { UsersCompanyService } from './../../resources/users/users-company.service';
import { PaymentsService } from './../../resources/payments/payments.service';

describe('TaskGenerationService', () => {
    let service: TaskGenerationService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TaskGenerationService,
                { provide: CompaniesService, useValue: createMock<CompaniesService>() },
                { provide: PayPeriodsService, useValue: createMock<PayPeriodsService>() },
                { provide: TasksService, useValue: createMock<TasksService>() },
                { provide: DepartmentsService, useValue: createMock<DepartmentsService>() },
                { provide: PositionsService, useValue: createMock<PositionsService>() },
                { provide: PersonsService, useValue: createMock<PersonsService>() },
                { provide: UsersCompanyService, useValue: createMock<UsersCompanyService>() },
                { provide: PaymentsService, useValue: createMock<PaymentsService>() },
            ],
        }).compile();

        service = await module.resolve<TaskGenerationService>(TaskGenerationService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
