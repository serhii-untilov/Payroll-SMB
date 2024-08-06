import {
    CompaniesService,
    DepartmentsService,
    PaymentsService,
    PayPeriodsService,
    PersonsService,
    PositionsService,
    TasksService,
    UserCompaniesService,
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
                { provide: CompaniesService, useValue: createMock<CompaniesService>() },
                { provide: PayPeriodsService, useValue: createMock<PayPeriodsService>() },
                { provide: TasksService, useValue: createMock<TasksService>() },
                { provide: DepartmentsService, useValue: createMock<DepartmentsService>() },
                { provide: PositionsService, useValue: createMock<PositionsService>() },
                { provide: PersonsService, useValue: createMock<PersonsService>() },
                { provide: UserCompaniesService, useValue: createMock<UserCompaniesService>() },
                { provide: PaymentsService, useValue: createMock<PaymentsService>() },
            ],
        }).compile();

        service = await module.resolve<TaskGenerationService>(TaskGenerationService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
