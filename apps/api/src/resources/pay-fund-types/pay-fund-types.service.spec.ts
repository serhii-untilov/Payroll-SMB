import { Test, TestingModule } from '@nestjs/testing';
import { FundTypesService } from './pay-fund-types.service';
import { MockType, repositoryMockFactory } from '@repo/testing';
import { Repository } from 'typeorm';
import { PayFundType } from './entities/pay-fund-type.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AccessService } from '../access/access.service';
import { createMock } from '@golevelup/ts-jest';

describe('FundTypesService', () => {
    let service: FundTypesService;
    let repoMock: MockType<Repository<PayFundType>>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                FundTypesService,
                { provide: getRepositoryToken(PayFundType), useFactory: repositoryMockFactory },
                { provide: AccessService, useValue: createMock<AccessService>() },
            ],
        }).compile();

        service = module.get<FundTypesService>(FundTypesService);
        repoMock = module.get(getRepositoryToken(PayFundType));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(repoMock).toBeTruthy();
    });
});
