import { Test, TestingModule } from '@nestjs/testing';
import { PayrollsService } from './payrolls.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Payroll } from './entities/payroll.entity';
import { repositoryMockFactory } from '@repo/testing';
import { PositionsService } from '../positions/positions.service';
import { CompaniesService } from '../companies/companies.service';
import { createMock } from '@golevelup/ts-jest';
import { AccessService } from '../access/access.service';

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
                { provide: CompaniesService, useValue: createMock<CompaniesService>() },
                { provide: AccessService, useValue: createMock<AccessService>() },
            ],
        }).compile();

        service = module.get<PayrollsService>(PayrollsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
