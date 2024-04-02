import { Test, TestingModule } from '@nestjs/testing';
import { PersonsController } from './persons.controller';
import { PersonsService } from './persons.service';
import { UsersService } from '../users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Person } from './entities/person.entity';
import { repositoryMockFactory } from '@repo/testing';
import { createMock } from '@golevelup/ts-jest';

describe('PersonsController', () => {
    let controller: PersonsController;
    let service: PersonsService;
    let usersService: UsersService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PersonsController],
            providers: [
                PersonsService,
                {
                    provide: getRepositoryToken(Person),
                    useFactory: repositoryMockFactory,
                },
                { provide: UsersService, useValue: createMock<UsersService>() },
            ],
        }).compile();

        controller = module.get<PersonsController>(PersonsController);
        service = module.get<PersonsService>(PersonsService);
        usersService = module.get<UsersService>(UsersService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(service).toBeDefined();
        expect(usersService).toBeDefined();
    });
});
