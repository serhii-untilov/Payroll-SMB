import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockType, repositoryMockFactory } from '@repo/testing';
import { Repository } from 'typeorm';
import { AccessService } from '../access/access.service';
import { Person } from './entities/person.entity';
import { PersonsService } from './persons.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

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
                { provide: AccessService, useValue: createMock<AccessService>() },
                { provide: EventEmitter2, useValue: createMock<EventEmitter2>() },
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
