import { Test, TestingModule } from '@nestjs/testing';
import { PayFundTypesService } from './pay-fund-types.service';
import { MockType, repositoryMockFactory } from '@repo/testing';
import { Repository } from 'typeorm';
import { PayFundType } from './entities/pay-fund-type.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AccessService } from '../access/access.service';
import { createMock } from '@golevelup/ts-jest';

describe('PayFundTypesService', () => {
    let service: PayFundTypesService;
    let repoMock: MockType<Repository<PayFundType>>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PayFundTypesService,
                { provide: getRepositoryToken(PayFundType), useFactory: repositoryMockFactory },
                { provide: AccessService, useValue: createMock<AccessService>() },
            ],
        }).compile();

        service = module.get<PayFundTypesService>(PayFundTypesService);
        repoMock = module.get(getRepositoryToken(PayFundType));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(repoMock).toBeTruthy();
    });
});
