import { Module, forwardRef } from '@nestjs/common';
import { PaymentTypesModule } from '../resources/payment-types/payment-types.module';
import { WorkNormsModule } from '../resources/work-norms/work-norms.module';
import { AccessModule } from '../resources/access/access.module';
import { CompaniesModule } from '../resources/companies/companies.module';
import { PayPeriodsModule } from '../resources/pay-periods/pay-periods.module';
import { PayrollsModule } from '../resources/payrolls/payrolls.module';
import { PositionsModule } from '../resources/positions/positions.module';
import { PayrollCalculationService } from './payrollCalculation/payrollCalculation.service';
import { PositionListenerService } from './listeners/position-listener/position-listener.service';
import { PayFundCalculationService } from './payFundCalculation/payFundCalculation.service';
import { PayFundTypesModule } from './../resources/pay-fund-types/pay-fund-types.module';
import { MinWageModule } from './../resources/min-wage/min-wage.module';
import { PayFundsModule } from './../resources/pay-funds/pay-funds.module';
import { CompanyListenerService } from './listeners/company-listener/company-listener.service';

@Module({
    imports: [
        forwardRef(() => AccessModule),
        forwardRef(() => PaymentTypesModule),
        forwardRef(() => PayFundTypesModule),
        forwardRef(() => CompaniesModule),
        forwardRef(() => PositionsModule),
        forwardRef(() => PayrollsModule),
        forwardRef(() => PayFundsModule),
        forwardRef(() => PayPeriodsModule),
        forwardRef(() => WorkNormsModule),
        forwardRef(() => MinWageModule),
    ],
    controllers: [],
    providers: [
        PayrollCalculationService,
        PositionListenerService,
        PayFundCalculationService,
        CompanyListenerService,
    ],
    exports: [PayrollCalculationService, PayFundCalculationService],
})
export class ProcessorModule {}
