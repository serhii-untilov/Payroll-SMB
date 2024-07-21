import {
    AccessModule,
    CompaniesModule,
    DepartmentsModule,
    MinWageModule,
    PayFundTypesModule,
    PayFundsModule,
    PayPeriodsModule,
    PaymentPositionsModule,
    PaymentTypesModule,
    PaymentsModule,
    PayrollsModule,
    PersonsModule,
    PositionsModule,
    TasksModule,
    UserCompaniesModule,
    UsersModule,
    WorkNormsModule,
} from '@/resources';
import { Module, forwardRef } from '@nestjs/common';
import { CompanyListenerService } from './listeners/company-listener/company-listener.service';
import { DepartmentListenerService } from './listeners/department-listener/department-listener.service';
import { PaymentListenerService } from './listeners/payment-listener/payment-listener.service';
import { PersonListenerService } from './listeners/person-listener/person-listener.service';
import { PositionListenerService } from './listeners/position-listener/position-listener.service';
import { PayFundCalculationService } from './pay-fund-calculation/pay-fund-calculation.service';
import { PayPeriodCalculationService } from './pay-period-calculation/pay-period-calculation.service';
import { PaymentCalculationService } from './payment-calculation/payment-calculation.service';
import { PayrollCalculationService } from './payroll-calculation/payroll-calculation.service';
import { SseController } from './server-sent-events/sse.controller';
import { SseService } from './server-sent-events/sse.service';
import { TaskGenerationService } from './task-generation/task-generator.service';

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
        forwardRef(() => PaymentPositionsModule),
        forwardRef(() => UserCompaniesModule),
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
