import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from '@repo/testing';
import { AccessService } from '../access/access.service';
import { PayPeriodsService } from '../pay-periods/payPeriods.service';
import { PositionsService } from '../positions/positions.service';
import { PositionHistory } from './entities/position-history.entity';
import { PositionHistoryController } from './position-history.controller';
import { PositionHistoryService } from './position-history.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('PositionHistoryController', () => {
    let controller: PositionHistoryController;
    let service: PositionHistoryService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PositionHistoryController],
            providers: [
                PositionHistoryService,
                {
                    provide: getRepositoryToken(PositionHistory),
                    useFactory: repositoryMockFactory,
                },
                { provide: PositionsService, useValue: createMock<PositionsService>() },
                { provide: PayPeriodsService, useValue: createMock<PayPeriodsService>() },
                { provide: AccessService, useValue: createMock<AccessService>() },
                { provide: EventEmitter2, useValue: createMock<EventEmitter2>() },
            ],
        }).compile();

        controller = module.get<PositionHistoryController>(PositionHistoryController);
        service = module.get<PositionHistoryService>(PositionHistoryService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(service).toBeDefined();
    });
});
