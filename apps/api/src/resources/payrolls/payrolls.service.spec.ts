import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from 'test';
import { AccessService } from '../access/access.service';
import { PositionsService } from '../positions/positions.service';
import { Payroll } from './entities/payroll.entity';
import { PayrollsService } from './payrolls.service';

describe('PayrollService', () => {
    let service: PayrollsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PayrollsService,
                {
                    provide: getRepositoryToken(Payroll),
                    useFactory: repositoryMockFactory,
                },
                { provide: PositionsService, useValue: createMock<PositionsService>() },
                { provide: AccessService, useValue: createMock<AccessService>() },
            ],
        }).compile();

        service = module.get<PayrollsService>(PayrollsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
