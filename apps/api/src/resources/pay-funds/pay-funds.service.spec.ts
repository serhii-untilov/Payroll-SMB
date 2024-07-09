import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from '@repo/testing';
import { AccessService } from '../access/access.service';
import { CompaniesService } from '../companies/companies.service';
import { PositionsService } from '../positions/positions.service';
import { PayFund } from './entities/pay-fund.entity';
import { PayFundsService } from './pay-funds.service';

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
