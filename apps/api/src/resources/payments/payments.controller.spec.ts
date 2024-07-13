import { createMock } from '@golevelup/ts-jest';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from '@repo/testing';
import { AccessService } from '../access/access.service';
import { CompaniesService } from '../companies/companies.service';
import { PayPeriodsService } from '../pay-periods/pay-periods.service';
import { PositionsService } from '../positions/positions.service';
import { Payment } from './entities/payment.entity';
import { PaymentPositionsService } from './payment-positions/payment-positions.service';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

describe('PaymentsController', () => {
    let controller: PaymentsController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PaymentsController],
            providers: [
                PaymentsService,
                {
                    provide: getRepositoryToken(Payment),
                    useFactory: repositoryMockFactory,
                },
                { provide: PositionsService, useValue: createMock<PositionsService>() },
                { provide: CompaniesService, useValue: createMock<CompaniesService>() },
                { provide: AccessService, useValue: createMock<AccessService>() },
                {
                    provide: PaymentPositionsService,
                    useValue: createMock<PaymentPositionsService>(),
                },
                { provide: EventEmitter2, useValue: createMock<EventEmitter2>() },
                { provide: PayPeriodsService, useValue: createMock<PayPeriodsService>() },
            ],
        }).compile();

        controller = module.get<PaymentsController>(PaymentsController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
