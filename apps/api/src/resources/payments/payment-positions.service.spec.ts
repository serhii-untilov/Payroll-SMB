import { Test, TestingModule } from '@nestjs/testing';
import { PaymentPositionsService } from './payment-positions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PaymentPosition } from './entities/paymentPosition.entity';
import { repositoryMockFactory } from '@repo/testing';
import { PositionsService } from '../positions/positions.service';
import { createMock } from '@golevelup/ts-jest';
import { CompaniesService } from '../companies/companies.service';
import { AccessService } from '../access/access.service';
import { PaymentsService } from './payments.service';

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
                { provide: PositionsService, useValue: createMock<PositionsService>() },
                { provide: CompaniesService, useValue: createMock<CompaniesService>() },
                { provide: AccessService, useValue: createMock<AccessService>() },
                { provide: PaymentsService, useValue: createMock<PaymentsService>() },
            ],
        }).compile();

        service = module.get<PaymentPositionsService>(PaymentPositionsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
