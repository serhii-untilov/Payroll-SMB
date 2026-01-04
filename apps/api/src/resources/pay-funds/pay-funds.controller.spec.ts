import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from 'test';
import { AccessService } from '../access/access.service';
import { CompanyService } from '../companies/company.service';
import { PositionsService } from '../positions/positions.service';
import { PayFund } from './entities/pay-fund.entity';
import { PayFundsController } from './pay-funds.controller';
import { PayFundsService } from './pay-funds.service';

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
                { provide: CompanyService, useValue: createMock<CompanyService>() },
                { provide: AccessService, useValue: createMock<AccessService>() },
            ],
        }).compile();

        controller = module.get<PayFundsController>(PayFundsController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
