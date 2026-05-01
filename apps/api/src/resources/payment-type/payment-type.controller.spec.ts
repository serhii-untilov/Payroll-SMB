import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from '@/test';
import { UserAccessService } from '../user-access/user-access.service';
import { PaymentType } from './entities/payment-type.entity';
import { PaymentTypeController } from './payment-type.controller';
import { PaymentTypeService } from './payment-type.service';

describe('PaymentTypeController', () => {
    let controller: PaymentTypeController;
    let service: PaymentTypeService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PaymentTypeController],
            providers: [
                PaymentTypeService,
                { provide: getRepositoryToken(PaymentType), useFactory: repositoryMockFactory },
                { provide: UserAccessService, useValue: createMock<UserAccessService>() },
            ],
        }).compile();

        controller = module.get<PaymentTypeController>(PaymentTypeController);
        service = module.get<PaymentTypeService>(PaymentTypeService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(service).toBeDefined();
    });
});
