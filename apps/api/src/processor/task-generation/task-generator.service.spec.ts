import {
    CompanyService,
    DepartmentsService,
    PaymentsService,
    PayPeriodsService,
    PersonService,
    PositionsService,
    TasksService,
    UserRoleService,
} from '@/resources';
import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { TaskGenerationService } from './task-generator.service';

describe('TaskGenerationService', () => {
    let service: TaskGenerationService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TaskGenerationService,
                { provide: CompanyService, useValue: createMock<CompanyService>() },
                { provide: PayPeriodsService, useValue: createMock<PayPeriodsService>() },
                { provide: TasksService, useValue: createMock<TasksService>() },
                { provide: DepartmentsService, useValue: createMock<DepartmentsService>() },
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
