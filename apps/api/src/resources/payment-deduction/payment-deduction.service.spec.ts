import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from '@/test';
import { PaymentPositionService } from '../payment-position/payment-position.service';
import { PaymentsService } from '../payments/payments.service';
import { PaymentDeduction } from './entities/payment-deduction.entity';
import { PaymentDeductionService } from './payment-deduction.service';
import { UserAccessService } from '../user-access/user-access.service';

describe('PaymentDeductionService', () => {
    let service: PaymentDeductionService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PaymentDeductionService,
                {
                    provide: getRepositoryToken(PaymentDeduction),
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

        service = module.get<PaymentDeductionService>(PaymentDeductionService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
