import { Test, TestingModule } from '@nestjs/testing';
import { PaymentFundsController } from './payment-funds.controller';

describe('PaymentFundsController', () => {
    let controller: PaymentFundsController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PaymentFundsController],
        }).compile();

        controller = module.get<PaymentFundsController>(PaymentFundsController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
