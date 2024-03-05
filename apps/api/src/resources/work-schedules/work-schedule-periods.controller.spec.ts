import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from '@repo/utils';
import { WorkSchedulePeriod } from './entities/work-schedule-period.entity';
import { WorkSchedulePeriodsController } from './work-schedule-periods.controller';
import { WorkSchedulePeriodsService } from './work-schedule-periods.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

describe('WorkSchedulePeriodsController', () => {
    let controller: WorkSchedulePeriodsController;
    let service: WorkSchedulePeriodsService;
    let usersService: UsersService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [WorkSchedulePeriodsController],
            providers: [
                WorkSchedulePeriodsService,
                UsersService,
                {
                    provide: getRepositoryToken(WorkSchedulePeriod),
                    useFactory: repositoryMockFactory,
                },
                {
                    provide: getRepositoryToken(User),
                    useFactory: repositoryMockFactory,
                },
            ],
        }).compile();

        controller = module.get<WorkSchedulePeriodsController>(WorkSchedulePeriodsController);
        service = module.get<WorkSchedulePeriodsService>(WorkSchedulePeriodsService);
        usersService = module.get<UsersService>(UsersService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(service).toBeDefined();
        expect(usersService).toBeDefined();
    });
});
