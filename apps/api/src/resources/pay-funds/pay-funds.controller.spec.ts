import { Test, TestingModule } from '@nestjs/testing';
import { PayFundsController } from './pay-funds.controller';
import { PayFundsService } from './pay-funds.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PayFund } from './entities/pay-fund.entity';
import { repositoryMockFactory } from '@repo/testing';
import { PositionsService } from '../positions/positions.service';
import { CompaniesService } from '../companies/companies.service';
import { AccessService } from '../access/access.service';
import { createMock } from '@golevelup/ts-jest';

describe('FundController', () => {
    let controller: PayFundsController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PayFundsController],
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

        controller = module.get<PayFundsController>(PayFundsController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
