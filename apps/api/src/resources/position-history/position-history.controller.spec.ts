import { Test, TestingModule } from '@nestjs/testing';
import { PositionHistoryController } from './position-history.controller';
import { PositionHistoryService } from './position-history.service';
import { UsersService } from '../users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PositionHistory } from './entities/position-history.entity';
import { repositoryMockFactory } from '@repo/testing';
import { createMock } from '@golevelup/ts-jest';
import { PositionsService } from '../positions/positions.service';
import { AccessService } from '../access/access.service';

describe('PositionHistoryController', () => {
    let controller: PositionHistoryController;
    let service: PositionHistoryService;
    let usersService: UsersService;
    let positionsService: PositionsService;
    let accessService: AccessService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PositionHistoryController],
            providers: [
                PositionHistoryService,
                {
                    provide: getRepositoryToken(PositionHistory),
                    useFactory: repositoryMockFactory,
                },
                { provide: UsersService, useValue: createMock<UsersService>() },
                { provide: PositionsService, useValue: createMock<PositionsService>() },
                { provide: AccessService, useValue: createMock<AccessService>() },
            ],
        }).compile();

        controller = module.get<PositionHistoryController>(PositionHistoryController);
        service = module.get<PositionHistoryService>(PositionHistoryService);
        usersService = module.get<UsersService>(UsersService);
        positionsService = module.get<PositionsService>(PositionsService);
        accessService = module.get<AccessService>(AccessService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(service).toBeDefined();
        expect(usersService).toBeDefined();
        expect(positionsService).toBeDefined();
        expect(accessService).toBeDefined();
    });
});
