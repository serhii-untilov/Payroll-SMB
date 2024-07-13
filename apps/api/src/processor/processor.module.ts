import { AccessModule } from '@/resources/access/access.module';
import { CompaniesModule } from '@/resources/companies/companies.module';
import { DepartmentsModule } from '@/resources/departments/departments.module';
import { MinWageModule } from '@/resources/min-wage/min-wage.module';
import { PayFundTypesModule } from '@/resources/pay-fund-types/pay-fund-types.module';
import { PayFundsModule } from '@/resources/pay-funds/pay-funds.module';
import { PayPeriodsModule } from '@/resources/pay-periods/pay-periods.module';
import { PaymentTypesModule } from '@/resources/payment-types/payment-types.module';
import { PaymentsModule } from '@/resources/payments/payments.module';
import { PayrollsModule } from '@/resources/payrolls/payrolls.module';
import { PersonsModule } from '@/resources/persons/persons.module';
import { PositionsModule } from '@/resources/positions/positions.module';
import { TasksModule } from '@/resources/tasks/tasks.module';
import { UsersModule } from '@/resources/users/users.module';
import { WorkNormsModule } from '@/resources/work-norms/work-norms.module';
import { Module, forwardRef } from '@nestjs/common';
import { CompanyListenerService } from './listeners/company-listener/company-listener.service';
import { DepartmentListenerService } from './listeners/department-listener/department-listener.service';
import { PaymentListenerService } from './listeners/payment-listener/payment-listener.service';
import { PersonListenerService } from './listeners/person-listener/person-listener.service';
import { PositionListenerService } from './listeners/position-listener/position-listener.service';
import { PayFundCalculationService } from './payFundCalculation/payFundCalculation.service';
import { PayPeriodCalculationService } from './payPeriodCalculation/payPeriodCalculation.service';
import { PaymentCalculationService } from './paymentCalculation/payment-calculation.service';
import { PayrollCalculationService } from './payrollCalculation/payrollCalculation.service';
import { SseController } from './serverSentEvents/sse.controller';
import { SseService } from './serverSentEvents/sse.service';
import { TaskGenerationService } from './taskGeneration/taskGeneration.service';

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
        forwardRef(() => TasksModule),
        forwardRef(() => DepartmentsModule),
        forwardRef(() => PersonsModule),
        forwardRef(() => UsersModule),
        forwardRef(() => PaymentsModule),
    ],
    controllers: [SseController],
    providers: [
        CompanyListenerService,
        DepartmentListenerService,
        PositionListenerService,
        PersonListenerService,
        PaymentListenerService,
        PayrollCalculationService,
        PayFundCalculationService,
        TaskGenerationService,
        PayPeriodCalculationService,
        SseService,
        PaymentCalculationService,
    ],
})
export class ProcessorModule {}
