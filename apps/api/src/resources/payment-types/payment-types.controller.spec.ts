import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from '@repo/testing';
import { PaymentType } from './entities/payment-type.entity';
import { PaymentTypesController } from './payment-types.controller';
import { PaymentTypesService } from './payment-types.service';

describe('PaymentTypesController', () => {
    let controller: PaymentTypesController;
    let service: PaymentTypesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PaymentTypesController],
            providers: [
                PaymentTypesService,
                {
                    provide: getRepositoryToken(PaymentType),
                    useFactory: repositoryMockFactory,
                },
            ],
        }).compile();

        controller = module.get<PaymentTypesController>(PaymentTypesController);
        service = module.get<PaymentTypesService>(PaymentTypesService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(service).toBeDefined();
    });
});
