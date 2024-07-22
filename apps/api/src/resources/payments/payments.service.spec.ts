import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from 'test';
import { AccessService } from '../access/access.service';
import { Payment } from './entities/payment.entity';
import { PaymentPositionsService } from '../payment-positions/payment-positions.service';
import { PaymentsService } from './payments.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PayPeriodsService } from '../pay-periods/pay-periods.service';
import { CompaniesService } from '../companies';

describe('PaymentsService', () => {
    let service: PaymentsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PaymentsService,
                {
                    provide: getRepositoryToken(Payment),
                    useFactory: repositoryMockFactory,
                },
                {
                    provide: PaymentPositionsService,
                    useValue: createMock<PaymentPositionsService>(),
                },
                { provide: AccessService, useValue: createMock<AccessService>() },
                { provide: EventEmitter2, useValue: createMock<EventEmitter2>() },
                { provide: PayPeriodsService, useValue: createMock<PayPeriodsService>() },
                { provide: CompaniesService, useValue: createMock<CompaniesService>() },
            ],
        }).compile();

        service = module.get<PaymentsService>(PaymentsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
