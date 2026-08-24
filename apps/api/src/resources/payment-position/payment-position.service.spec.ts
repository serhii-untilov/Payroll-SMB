import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from '@/test';
import { PaymentsService } from '../payments/payments.service';
import { PaymentPosition } from './entities/paymentPosition.entity';
import { PaymentPositionService } from './payment-position.service';
import { UserAccessService } from '../user-access/user-access.service';
import { PayrollsService } from '../payrolls/payrolls.service';

describe('PaymentPositionService', () => {
    let service: PaymentPositionService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PaymentPositionService,
                {
                    provide: getRepositoryToken(PaymentPosition),
                    useFactory: repositoryMockFactory,
                },
                { provide: UserAccessService, useValue: createMock<UserAccessService>() },
                { provide: PaymentsService, useValue: createMock<PaymentsService>() },
                { provide: PayrollsService, useValue: createMock<PayrollsService>() },
            ],
        }).compile();

        service = module.get<PaymentPositionService>(PaymentPositionService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
