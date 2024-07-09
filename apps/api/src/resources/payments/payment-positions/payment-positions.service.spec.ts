import { AccessService } from '@/resources/access/access.service';
import { CompaniesService } from '@/resources/companies/companies.service';
import { PayrollsService } from '@/resources/payrolls/payrolls.service';
import { PositionsService } from '@/resources/positions/positions.service';
import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from '@repo/testing';
import { PaymentsService } from '../payments.service';
import { PaymentPosition } from './entities/paymentPosition.entity';
import { PaymentPositionsService } from './payment-positions.service';

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
                { provide: PayrollsService, useValue: createMock<PayrollsService>() },
            ],
        }).compile();

        service = module.get<PaymentPositionsService>(PaymentPositionsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
