import { Test, TestingModule } from '@nestjs/testing';
import { PersonsService } from './persons.service';
import { MockType, repositoryMockFactory } from '@repo/testing';
import { Repository } from 'typeorm';
import { Person } from './entities/person.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { createMock } from '@golevelup/ts-jest';

describe('PersonsService', () => {
    let service: PersonsService;
    let repoMock: MockType<Repository<Person>>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PersonsService,
                {
                    provide: getRepositoryToken(Person),
                    useFactory: repositoryMockFactory,
                },
                { provide: UsersService, useValue: createMock<UsersService>() },
            ],
        }).compile();

        service = module.get<PersonsService>(PersonsService);
        repoMock = module.get(getRepositoryToken(Person));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(repoMock).toBeTruthy();
    });
});
