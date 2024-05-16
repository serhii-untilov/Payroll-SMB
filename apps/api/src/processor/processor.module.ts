import { Module, forwardRef } from '@nestjs/common';
import { AccessModule } from '../resources/access/access.module';
import { CompaniesModule } from '../resources/companies/companies.module';
import { PayPeriodsModule } from '../resources/pay-periods/pay-periods.module';
import { PayrollsModule } from '../resources/payrolls/payrolls.module';
import { PositionsModule } from '../resources/positions/positions.module';
import { SalaryCalculationService } from './salaryCalculation/salary-calculation.service';
import { WorkNormsModule } from 'src/resources/work-norms/work-norms.module';

@Module({
    imports: [
        forwardRef(() => AccessModule),
        forwardRef(() => CompaniesModule),
        forwardRef(() => PositionsModule),
        forwardRef(() => PayrollsModule),
        forwardRef(() => PayPeriodsModule),
        forwardRef(() => WorkNormsModule),
    ],
    controllers: [],
    providers: [SalaryCalculationService],
    exports: [SalaryCalculationService],
})
export class ProcessorModule {}
