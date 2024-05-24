import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from '@repo/testing';
import { AccessService } from '../access/access.service';
import { PayFundType } from './entities/pay-fund-type.entity';
import { FundTypesController } from './pay-fund-types.controller';
import { FundTypesService } from './pay-fund-types.service';

describe('FundTypesController', () => {
    let controller: FundTypesController;
    let service: FundTypesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [FundTypesController],
            providers: [
                FundTypesService,
                { provide: getRepositoryToken(PayFundType), useFactory: repositoryMockFactory },
                { provide: AccessService, useValue: createMock<AccessService>() },
            ],
        }).compile();

        controller = module.get<FundTypesController>(FundTypesController);
        service = module.get<FundTypesService>(FundTypesService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(service).toBeDefined();
    });
});
