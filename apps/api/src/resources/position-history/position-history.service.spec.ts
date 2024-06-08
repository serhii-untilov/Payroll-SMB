import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockType, repositoryMockFactory } from '@repo/testing';
import { Repository } from 'typeorm';
import { AccessService } from '../access/access.service';
import { PayPeriodsService } from '../pay-periods/payPeriods.service';
import { PositionsService } from '../positions/positions.service';
import { PositionHistory } from './entities/position-history.entity';
import { PositionHistoryService } from './position-history.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('PositionHistoryService', () => {
    let service: PositionHistoryService;
    let repoMock: MockType<Repository<PositionHistory>>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
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

        service = module.get<PositionHistoryService>(PositionHistoryService);
        repoMock = module.get(getRepositoryToken(PositionHistory));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(repoMock).toBeTruthy();
    });
});
