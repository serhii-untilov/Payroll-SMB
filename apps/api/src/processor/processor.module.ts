import {
    AccessModule,
    CompanyModule,
    DepartmentsModule,
    MinWageModule,
    PayFundTypesModule,
    PayFundsModule,
    PayPeriodsModule,
    PaymentPositionsModule,
    PaymentTypesModule,
    PaymentsModule,
    PayrollsModule,
    PersonModule,
    PositionsModule,
    TasksModule,
    UserRoleModule,
    UsersModule,
    WorkTimeNormModule,
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
import { ScheduleService } from './schedule/schedule.service';

@Module({
    imports: [
        forwardRef(() => AccessModule),
        forwardRef(() => PaymentTypesModule),
        forwardRef(() => PayFundTypesModule),
        forwardRef(() => CompanyModule),
        forwardRef(() => PositionsModule),
        forwardRef(() => PayrollsModule),
        forwardRef(() => PayFundsModule),
        forwardRef(() => PayPeriodsModule),
        forwardRef(() => WorkTimeNormModule),
        forwardRef(() => MinWageModule),
        forwardRef(() => TasksModule),
        forwardRef(() => DepartmentsModule),
        forwardRef(() => PersonModule),
        forwardRef(() => UsersModule),
        forwardRef(() => PaymentsModule),
        forwardRef(() => PaymentPositionsModule),
        forwardRef(() => UserRoleModule),
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
        ScheduleService,
    ],
})
export class ProcessorModule {}
