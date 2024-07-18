import { AccessService, CompaniesService, PayrollsService, PositionsService } from '@/resources';
import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from '@repo/testing';
import { PaymentsService } from '../payments/payments.service';
import { PaymentPosition } from './entities/paymentPosition.entity';
import { PaymentPositionsController } from './payment-positions.controller';
import { PaymentPositionsService } from './payment-positions.service';

describe('PaymentPositionsController', () => {
    let controller: PaymentPositionsController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PaymentPositionsController],
            providers: [
                PaymentPositionsService,
                {
                    provide: getRepositoryToken(PaymentPosition),
                    useFactory: repositoryMockFactory,
                },
                { provide: PositionsService, useValue: createMock<PositionsService>() },
                { provide: CompaniesService, useValue: createMock<CompaniesService>() },
                { provide: AccessService, useValue: createMock<AccessService>() },
                { provide: PaymentsService, useValue: createMock<PaymentsService>() },
                { provide: PayrollsService, useValue: createMock<PayrollsService>() },
            ],
        }).compile();

        controller = module.get<PaymentPositionsController>(PaymentPositionsController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
