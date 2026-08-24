import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from '@/test';
import { PaymentsService } from '../payments/payments.service';
import { PaymentPosition } from './entities/paymentPosition.entity';
import { PaymentPositionController } from './payment-position.controller';
import { PaymentPositionService } from './payment-position.service';
import { UserAccessService } from '../user-access/user-access.service';
import { PayrollsService } from '../payrolls/payrolls.service';

describe('PaymentPositionController', () => {
    let controller: PaymentPositionController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PaymentPositionController],
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

        controller = module.get<PaymentPositionController>(PaymentPositionController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
