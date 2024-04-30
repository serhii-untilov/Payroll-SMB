import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from '@repo/testing';
import { AccessService } from '../access/access.service';
import { UsersService } from '../users/users.service';
import { Position } from './entities/position.entity';
import { PositionsController } from './positions.controller';
import { PositionsService } from './positions.service';

describe('PositionsController', () => {
    let controller: PositionsController;
    let service: PositionsService;
    let usersService: UsersService;
    let accessService: AccessService;

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
                { provide: AccessService, useValue: createMock<AccessService>() },
            ],
        }).compile();

        controller = module.get<PositionsController>(PositionsController);
        service = module.get<PositionsService>(PositionsService);
        usersService = module.get<UsersService>(UsersService);
        accessService = module.get<AccessService>(AccessService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(service).toBeDefined();
        expect(usersService).toBeDefined();
        expect(accessService).toBeDefined();
    });
});
