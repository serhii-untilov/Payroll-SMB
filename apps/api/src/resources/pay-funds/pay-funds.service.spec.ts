import { Test, TestingModule } from '@nestjs/testing';
import { PayFundsService } from './pay-funds.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PayFund } from './entities/pay-fund.entity';
import { repositoryMockFactory } from '@repo/testing';
import { PositionsService } from '../positions/positions.service';
import { CompaniesService } from '../companies/companies.service';
import { createMock } from '@golevelup/ts-jest';
import { AccessService } from '../access/access.service';

describe('FundService', () => {
    let service: PayFundsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PayFundsService,
                {
                    provide: getRepositoryToken(PayFund),
                    useFactory: repositoryMockFactory,
                },
                { provide: PositionsService, useValue: createMock<PositionsService>() },
                { provide: CompaniesService, useValue: createMock<CompaniesService>() },
                { provide: AccessService, useValue: createMock<AccessService>() },
            ],
        }).compile();

        service = module.get<PayFundsService>(PayFundsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
