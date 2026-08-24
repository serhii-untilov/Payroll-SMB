import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { TaskGenerationService } from './task-generator.service';
import { CompanyService } from '../../resources/company/company.service';
import { DepartmentService } from '../../resources/department/department.service';
import { PayPeriodService } from '../../resources/pay-period/pay-period.service';
import { PaymentsService } from '../../resources/payments/payments.service';
import { PersonService } from '../../resources/person/person.service';
import { PositionsService } from '../../resources/positions/positions.service';
import { TasksService } from '../../resources/tasks/tasks.service';
import { UserRoleService } from '../../resources/user-role/user-role.service';

describe('TaskGenerationService', () => {
    let service: TaskGenerationService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TaskGenerationService,
                { provide: CompanyService, useValue: createMock<CompanyService>() },
                { provide: PayPeriodService, useValue: createMock<PayPeriodService>() },
                { provide: TasksService, useValue: createMock<TasksService>() },
                { provide: DepartmentService, useValue: createMock<DepartmentService>() },
                { provide: PositionsService, useValue: createMock<PositionsService>() },
                { provide: PersonService, useValue: createMock<PersonService>() },
                { provide: UserRoleService, useValue: createMock<UserRoleService>() },
                { provide: PaymentsService, useValue: createMock<PaymentsService>() },
            ],
        }).compile();

        service = await module.resolve<TaskGenerationService>(TaskGenerationService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
