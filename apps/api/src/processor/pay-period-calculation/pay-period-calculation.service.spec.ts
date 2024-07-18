import {
    CompaniesService,
    PayFundsService,
    PayPeriodsCalcMethodService,
    PayPeriodsService,
    PayrollsService,
    PositionsService,
    UsersService,
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
                    provide: CompaniesService,
                    useValue: createMock<CompaniesService>(),
                },
                {
                    provide: PayPeriodsService,
                    useValue: createMock<PayPeriodsService>(),
                },
                {
                    provide: PayPeriodsCalcMethodService,
                    useValue: createMock<PayPeriodsCalcMethodService>(),
                },
                {
                    provide: PayrollsService,
                    useValue: createMock<PayrollsService>(),
                },
                {
                    provide: PayFundsService,
                    useValue: createMock<PayFundsService>(),
                },
                {
                    provide: PositionsService,
                    useValue: createMock<PositionsService>(),
                },
                {
                    provide: UsersService,
                    useValue: createMock<UsersService>(),
                },
            ],
        }).compile();

        service = await module.resolve<PayPeriodCalculationService>(PayPeriodCalculationService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
