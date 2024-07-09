import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from '@repo/testing';
import { AccessService } from '@/resources/access/access.service';
import { PaymentFund } from '../entities/paymentFund.entity';
import { PaymentPositionsService } from '../payment-positions/payment-positions.service';
import { PaymentsService } from '../payments.service';
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
                { provide: AccessService, useValue: createMock<AccessService>() },
            ],
        }).compile();

        service = module.get<PaymentFundsService>(PaymentFundsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
