import {
    CompanyService,
    PayFundService,
    PayPeriodCalcMethodService,
    PayPeriodService,
    PayrollsService,
    PositionsService,
    UserService,
} from '@/resources';
import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { PayPeriodCalculationService } from './pay-period-calculation.service';

describe('PayPeriodCalculationService', () => {
    let service: PayPeriodCalculationService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PayPeriodCalculationService,
                {
                    provide: CompanyService,
                    useValue: createMock<CompanyService>(),
                },
                {
                    provide: PayPeriodService,
                    useValue: createMock<PayPeriodService>(),
                },
                {
                    provide: PayPeriodCalcMethodService,
                    useValue: createMock<PayPeriodCalcMethodService>(),
                },
                {
                    provide: PayrollsService,
                    useValue: createMock<PayrollsService>(),
                },
                {
                    provide: PayFundService,
                    useValue: createMock<PayFundService>(),
                },
                {
                    provide: PositionsService,
                    useValue: createMock<PositionsService>(),
                },
                {
                    provide: UserService,
                    useValue: createMock<UserService>(),
                },
            ],
        }).compile();

        service = await module.resolve<PayPeriodCalculationService>(PayPeriodCalculationService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
