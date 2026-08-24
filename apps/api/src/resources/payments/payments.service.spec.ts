import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from '@/test';
import { UserAccessService } from '../user-access/user-access.service';
import { Payment } from './entities/payment.entity';
import { PaymentPositionService } from '../payment-position/payment-position.service';
import { PaymentsService } from './payments.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PayPeriodService } from '../pay-period/pay-period.service';
import { CompanyService } from '../company/company.service';

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
                    provide: PaymentPositionService,
                    useValue: createMock<PaymentPositionService>(),
                },
                { provide: UserAccessService, useValue: createMock<UserAccessService>() },
                { provide: EventEmitter2, useValue: createMock<EventEmitter2>() },
                { provide: PayPeriodService, useValue: createMock<PayPeriodService>() },
                { provide: CompanyService, useValue: createMock<CompanyService>() },
            ],
        }).compile();

        service = module.get<PaymentsService>(PaymentsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
