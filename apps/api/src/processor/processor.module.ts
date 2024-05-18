import { Module, forwardRef } from '@nestjs/common';
import { AccessModule } from '../resources/access/access.module';
import { CompaniesModule } from '../resources/companies/companies.module';
import { PayPeriodsModule } from '../resources/pay-periods/pay-periods.module';
import { PayrollsModule } from '../resources/payrolls/payrolls.module';
import { PositionsModule } from '../resources/positions/positions.module';
import { PayrollCalculationService } from './payrollCalculation/payrollCalculation.service';
import { WorkNormsModule } from 'src/resources/work-norms/work-norms.module';
import { PaymentTypesModule } from 'src/resources/payment-types/payment-types.module';

@Module({
    imports: [
        forwardRef(() => AccessModule),
        forwardRef(() => PaymentTypesModule),
        forwardRef(() => CompaniesModule),
        forwardRef(() => PositionsModule),
        forwardRef(() => PayrollsModule),
        forwardRef(() => PayPeriodsModule),
        forwardRef(() => WorkNormsModule),
    ],
    controllers: [],
    providers: [PayrollCalculationService],
    exports: [PayrollCalculationService],
})
export class ProcessorModule {}
