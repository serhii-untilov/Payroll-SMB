import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from 'test';
import { UserAccessService } from '../user-access/user-access.service';
import { CompanyService } from '../company/company.service';
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
                { provide: CompanyService, useValue: createMock<CompanyService>() },
                { provide: UserAccessService, useValue: createMock<UserAccessService>() },
            ],
        }).compile();

        service = module.get<PayFundsService>(PayFundsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
