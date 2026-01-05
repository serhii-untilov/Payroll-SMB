import { createMock } from '@golevelup/ts-jest';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from 'test';
import { UserAccessService } from '../user-access/user-access.service';
import { CompanyService } from '../company/company.service';
import { PayPeriodsService } from '../pay-periods/pay-periods.service';
import { PositionsService } from '../positions/positions.service';
import { Payment } from './entities/payment.entity';
import { PaymentPositionsService } from '../payment-positions/payment-positions.service';
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
                { provide: CompanyService, useValue: createMock<CompanyService>() },
                { provide: UserAccessService, useValue: createMock<UserAccessService>() },
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
