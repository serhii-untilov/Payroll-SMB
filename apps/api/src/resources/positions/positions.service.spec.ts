import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockType, repositoryMockFactory } from '@repo/testing';
import { Repository } from 'typeorm';
import { AccessService } from '../access/access.service';
import { PayPeriodsService } from '../pay-periods/payPeriods.service';
import { Position } from './entities/position.entity';
import { PositionsService } from './positions.service';
import { PayrollsService } from '../payrolls/payrolls.service';
import { PositionBalance } from './entities/position-balance.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('PositionsService', () => {
    let service: PositionsService;
    let repoMock: MockType<Repository<Position>>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
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

        service = module.get<PositionsService>(PositionsService);
        repoMock = module.get(getRepositoryToken(Position));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(repoMock).toBeTruthy();
    });
});
