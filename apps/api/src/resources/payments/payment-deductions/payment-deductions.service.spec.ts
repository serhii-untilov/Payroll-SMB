import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from '@repo/testing';
import { AccessService } from '@/resources/access/access.service';
import { PaymentDeduction } from '../entities/paymentDeduction.entity';
import { PaymentPositionsService } from '../../payment-positions/payment-positions.service';
import { PaymentsService } from '../payments.service';
import { PaymentDeductionsService } from './payment-deductions.service';

describe('PaymentDeductionsService', () => {
    let service: PaymentDeductionsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PaymentDeductionsService,
                {
                    provide: getRepositoryToken(PaymentDeduction),
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

        service = module.get<PaymentDeductionsService>(PaymentDeductionsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
