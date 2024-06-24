import { Test, TestingModule } from '@nestjs/testing';
import { PaymentFundsService } from './payment-funds.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PaymentFund } from './entities/paymentFund.entity';
import { repositoryMockFactory } from '@repo/testing';
import { PaymentsService } from './payments.service';
import { createMock } from '@golevelup/ts-jest';
import { PaymentPositionsService } from './payment-positions.service';
import { AccessService } from '../access/access.service';

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
