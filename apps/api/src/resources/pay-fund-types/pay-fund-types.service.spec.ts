import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockType, repositoryMockFactory } from 'test';
import { Repository } from 'typeorm';
import { UserAccessService } from '../user-access/user-access.service';
import { PayFundType } from './entities/pay-fund-type.entity';
import { PayFundTypesService } from './pay-fund-types.service';

describe('PayFundTypesService', () => {
    let service: PayFundTypesService;
    let repoMock: MockType<Repository<PayFundType>>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PayFundTypesService,
                { provide: getRepositoryToken(PayFundType), useFactory: repositoryMockFactory },
                { provide: UserAccessService, useValue: createMock<UserAccessService>() },
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
