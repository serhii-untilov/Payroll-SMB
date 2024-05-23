import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from '@repo/testing';
import { AccessService } from '../access/access.service';
import { PayPeriodsService } from '../pay-periods/pay-periods.service';
import { Position } from './entities/position.entity';
import { PositionsController } from './positions.controller';
import { PositionsService } from './positions.service';
import { PayrollsService } from '../payrolls/payrolls.service';
import { PositionBalance } from './entities/position-balance.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('PositionsController', () => {
    let controller: PositionsController;
    let service: PositionsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PositionsController],
            providers: [
                PositionsService,
                {
                    provide: getRepositoryToken(Position),
                    useFactory: repositoryMockFactory,
                },
                {
                    provide: getRepositoryToken(PositionBalance),
                    useFactory: repositoryMockFactory,
                },
                { provide: AccessService, useValue: createMock<AccessService>() },
                { provide: PayPeriodsService, useValue: createMock<PayPeriodsService>() },
                { provide: PayrollsService, useValue: createMock<PayrollsService>() },
                { provide: EventEmitter2, useValue: createMock<EventEmitter2>() },
            ],
        }).compile();

        controller = module.get<PositionsController>(PositionsController);
        service = module.get<PositionsService>(PositionsService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(service).toBeDefined();
    });
});
