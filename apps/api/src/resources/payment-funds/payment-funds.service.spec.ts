import { UserAccessService, PaymentPositionsService, PaymentsService } from '@/resources';
import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from 'test';
import { PaymentFund } from './entities/payment-fund.entity';
import { PaymentFundsService } from './payment-funds.service';

describe('PaymentFundsService', () => {
    let service: PaymentFundsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PaymentFundsService,
                {
                    provide: getRepositoryToken(PaymentFund),
                    useFactory: repositoryMockFactory,
                },
                { provide: PaymentsService, useValue: createMock<PaymentsService>() },
                {
                    provide: PaymentPositionsService,
                    useValue: createMock<PaymentPositionsService>(),
                },
                { provide: UserAccessService, useValue: createMock<UserAccessService>() },
            ],
        }).compile();

        service = module.get<PaymentFundsService>(PaymentFundsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
