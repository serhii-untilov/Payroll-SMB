import { Test, TestingModule } from '@nestjs/testing';
import { WorkSchedulesController } from './work-schedules.controller';
import { WorkSchedulesService } from './work-schedules.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { WorkSchedule } from './entities/work-schedule.entity';
import { repositoryMockFactory } from '@repo/utils';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

describe('WorkSchedulesController', () => {
    let controller: WorkSchedulesController;
    let service: WorkSchedulesService;
    let usersService: UsersService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [WorkSchedulesController],
            providers: [
                WorkSchedulesService,
                UsersService,
                {
                    provide: getRepositoryToken(WorkSchedule),
                    useFactory: repositoryMockFactory,
                },
                {
                    provide: getRepositoryToken(User),
                    useFactory: repositoryMockFactory,
                },
            ],
        }).compile();

        controller = module.get<WorkSchedulesController>(WorkSchedulesController);
        service = module.get<WorkSchedulesService>(WorkSchedulesService);
        usersService = module.get<UsersService>(UsersService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(service).toBeDefined();
        expect(usersService).toBeDefined();
    });
});
