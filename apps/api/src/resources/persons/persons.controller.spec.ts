import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from '@repo/testing';
import { AccessService } from '../access/access.service';
import { Person } from './entities/person.entity';
import { PersonsController } from './persons.controller';
import { PersonsService } from './persons.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('PersonsController', () => {
    let controller: PersonsController;
    let service: PersonsService;
    let accessService: AccessService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PersonsController],
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

        controller = module.get<PersonsController>(PersonsController);
        service = module.get<PersonsService>(PersonsService);
        accessService = module.get<AccessService>(AccessService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(service).toBeDefined();
        expect(accessService).toBeDefined();
    });
});
