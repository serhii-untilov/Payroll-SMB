import { Test, TestingModule } from '@nestjs/testing';
import { PositionsController } from './positions.controller';
import { PositionsService } from './positions.service';
import { UsersService } from '../users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Position } from './entities/position.entity';
import { repositoryMockFactory } from '@repo/testing';
import { createMock } from '@golevelup/ts-jest';

describe('PositionsController', () => {
    let controller: PositionsController;
    let service: PositionsService;
    let usersService: UsersService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PositionsController],
            providers: [
                PositionsService,
                {
                    provide: getRepositoryToken(Position),
                    useFactory: repositoryMockFactory,
                },
                { provide: UsersService, useValue: createMock<UsersService>() },
            ],
        }).compile();

        controller = module.get<PositionsController>(PositionsController);
        service = module.get<PositionsService>(PositionsService);
        usersService = module.get<UsersService>(UsersService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(service).toBeDefined();
        expect(usersService).toBeDefined();
    });
});
