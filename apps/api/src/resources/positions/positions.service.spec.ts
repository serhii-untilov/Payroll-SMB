import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockType, repositoryMockFactory } from '@repo/testing';
import { Repository } from 'typeorm';
import { AccessService } from '../access/access.service';
import { PayPeriodsService } from '../pay-periods/pay-periods.service';
import { Position } from './entities/position.entity';
import { PositionsService } from './positions.service';

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
                { provide: AccessService, useValue: createMock<AccessService>() },
                { provide: PayPeriodsService, useValue: createMock<PayPeriodsService>() },
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
