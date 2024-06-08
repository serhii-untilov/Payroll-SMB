import { Test, TestingModule } from '@nestjs/testing';
import { PayPeriodCalculationService } from './payPeriodCalculation.service';
import { CompaniesService } from './../../resources/companies/companies.service';
import { createMock } from '@golevelup/ts-jest';
import { PayPeriodsService } from './../../resources/pay-periods/payPeriods.service';
import { PayPeriodsCalcMethodService } from './../../resources/pay-periods/payPeriodsCalcMethod.service';
import { PayrollsService } from './../../resources/payrolls/payrolls.service';
import { PayFundsService } from './../../resources/pay-funds/pay-funds.service';
import { PositionsService } from './../../resources/positions/positions.service';
import { UsersService } from './../../resources/users/users.service';

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
