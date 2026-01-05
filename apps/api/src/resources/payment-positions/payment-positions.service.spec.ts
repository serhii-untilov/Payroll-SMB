import { UserAccessService, PayrollsService } from '@/resources';
import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from 'test';
import { PaymentsService } from '../payments/payments.service';
import { PaymentPosition } from './entities/paymentPosition.entity';
import { PaymentPositionsService } from './payment-positions.service';

describe('PaymentPositionsService', () => {
    let service: PaymentPositionsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PaymentPositionsService,
                {
                    provide: getRepositoryToken(PaymentPosition),
                    useFactory: repositoryMockFactory,
                },
                { provide: UserAccessService, useValue: createMock<UserAccessService>() },
                { provide: PaymentsService, useValue: createMock<PaymentsService>() },
                { provide: PayrollsService, useValue: createMock<PayrollsService>() },
            ],
        }).compile();

        service = module.get<PaymentPositionsService>(PaymentPositionsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
