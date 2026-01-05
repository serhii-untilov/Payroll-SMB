import { createMock } from '@golevelup/ts-jest';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from 'test';
import { UserAccessService } from '../user-access/user-access.service';
import { PersonEntity } from './entities/person.entity';
import { PersonController } from './person.controller';

describe('PersonController', () => {
    let controller: PersonController;
    let accessService: UserAccessService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PersonController],
            providers: [
                {
                    provide: getRepositoryToken(PersonEntity),
                    useFactory: repositoryMockFactory,
                },
                { provide: UserAccessService, useValue: createMock<UserAccessService>() },
                { provide: EventEmitter2, useValue: createMock<EventEmitter2>() },
            ],
        }).compile();

        controller = module.get<PersonController>(PersonController);
        accessService = module.get<UserAccessService>(UserAccessService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(accessService).toBeDefined();
    });
});
