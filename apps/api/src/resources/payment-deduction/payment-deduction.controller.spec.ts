import { Test, TestingModule } from '@nestjs/testing';
import { PaymentDeductionController } from './payment-deduction.controller';

describe('PaymentDeductionController', () => {
    let controller: PaymentDeductionController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PaymentDeductionController],
        }).compile();

        controller = module.get<PaymentDeductionController>(PaymentDeductionController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
