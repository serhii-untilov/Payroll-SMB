import { Test, TestingModule } from '@nestjs/testing';
import { PaymentDeductionsController } from './payment-deductions.controller';

describe('PaymentDeductionsController', () => {
    let controller: PaymentDeductionsController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PaymentDeductionsController],
        }).compile();

        controller = module.get<PaymentDeductionsController>(PaymentDeductionsController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
