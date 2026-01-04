import { createMock } from '@golevelup/ts-jest';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from 'test';
import { AccessService } from '../access/access.service';
import { PersonEntity } from './entities/person.entity';
import { PersonController } from './person.controller';

describe('PersonController', () => {
    let controller: PersonController;
    let accessService: AccessService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PersonController],
            providers: [
                {
                    provide: getRepositoryToken(PersonEntity),
                    useFactory: repositoryMockFactory,
                },
                { provide: AccessService, useValue: createMock<AccessService>() },
                { provide: EventEmitter2, useValue: createMock<EventEmitter2>() },
            ],
        }).compile();

        controller = module.get<PersonController>(PersonController);
        accessService = module.get<AccessService>(AccessService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(accessService).toBeDefined();
    });
});
