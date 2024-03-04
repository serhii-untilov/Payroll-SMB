import { Test, TestingModule } from '@nestjs/testing';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { repositoryMockFactory } from '@repo/utils';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

describe('JobsController', () => {
    let controller: JobsController;
    let service: JobsService;
    let usersService: UsersService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [JobsController],
            providers: [
                JobsService,
                UsersService,
                {
                    provide: getRepositoryToken(Job),
                    useFactory: repositoryMockFactory,
                },
                {
                    provide: getRepositoryToken(User),
                    useFactory: repositoryMockFactory,
                },
            ],
        }).compile();

        controller = module.get<JobsController>(JobsController);
        service = module.get<JobsService>(JobsService);
        usersService = module.get<UsersService>(UsersService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(service).toBeDefined();
        expect(usersService).toBeDefined();
    });
});
