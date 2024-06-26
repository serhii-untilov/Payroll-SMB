import { Test, TestingModule } from '@nestjs/testing';
import { PaymentPositionsController } from './payment-positions.controller';
import { PaymentPositionsService } from './payment-positions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PaymentPosition } from './entities/paymentPosition.entity';
import { repositoryMockFactory } from '@repo/testing';
import { PositionsService } from './../../../resources/positions/positions.service';
import { createMock } from '@golevelup/ts-jest';
import { CompaniesService } from './../../../resources/companies/companies.service';
import { AccessService } from './../../../resources/access/access.service';
import { PaymentsService } from '../payments.service';
import { PayrollsService } from './../../payrolls/payrolls.service';

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
