import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from '@/test';
import { PaymentPositionService } from '../payment-position/payment-position.service';
import { PaymentsService } from '../payments/payments.service';
import { PaymentFund } from './entities/payment-fund.entity';
import { PaymentFundsService } from './payment-funds.service';
import { UserAccessService } from '../user-access/user-access.service';

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
                    provide: PaymentPositionService,
                    useValue: createMock<PaymentPositionService>(),
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
