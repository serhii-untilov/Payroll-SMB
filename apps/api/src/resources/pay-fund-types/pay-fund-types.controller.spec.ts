import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from '@repo/testing';
import { AccessService } from '../access/access.service';
import { PayFundType } from './entities/pay-fund-type.entity';
import { PayFundTypesController } from './pay-fund-types.controller';
import { PayFundTypesService } from './pay-fund-types.service';

describe('PayFundTypesController', () => {
    let controller: PayFundTypesController;
    let service: PayFundTypesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PayFundTypesController],
            providers: [
                PayFundTypesService,
                { provide: getRepositoryToken(PayFundType), useFactory: repositoryMockFactory },
                { provide: AccessService, useValue: createMock<AccessService>() },
            ],
        }).compile();

        controller = module.get<PayFundTypesController>(PayFundTypesController);
        service = module.get<PayFundTypesService>(PayFundTypesService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(service).toBeDefined();
    });
});
