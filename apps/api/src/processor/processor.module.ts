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
import { UserAccessModule } from '../resources/user-access/user-access.module';
import { CompanyModule } from '../resources/company/company.module';
import { DepartmentModule } from '../resources/department/department.module';
import { MinWageModule } from '../resources/min-wage/min-wage.module';
import { PayFundTypesModule } from '../resources/pay-fund-types/pay-fund-types.module';
import { PayFundModule } from '../resources/pay-fund/pay-fund.module';
import { PayPeriodModule } from '../resources/pay-period/pay-period.module';
import { PaymentPositionModule } from '../resources/payment-position/payment-position.module';
import { PaymentTypeModule } from '../resources/payment-type/payment-type.module';
import { PaymentsModule } from '../resources/payments/payments.module';
import { PayrollsModule } from '../resources/payrolls/payrolls.module';
import { PersonModule } from '../resources/person/person.module';
import { PositionsModule } from '../resources/positions/positions.module';
import { TasksModule } from '../resources/tasks/tasks.module';
import { UserRoleModule } from '../resources/user-role/user-role.module';
import { UserModule } from '../resources/user/user.module';
import { WorkTimeNormModule } from '../resources/work-time-norm/work-time-norm.module';

@Module({
    imports: [
        forwardRef(() => UserAccessModule),
        forwardRef(() => PaymentTypeModule),
        forwardRef(() => PayFundTypesModule),
        forwardRef(() => CompanyModule),
        forwardRef(() => PositionsModule),
        forwardRef(() => PayrollsModule),
        forwardRef(() => PayFundModule),
        forwardRef(() => PayPeriodModule),
        forwardRef(() => WorkTimeNormModule),
        forwardRef(() => MinWageModule),
        forwardRef(() => TasksModule),
        forwardRef(() => DepartmentModule),
        forwardRef(() => PersonModule),
        forwardRef(() => UserModule),
        forwardRef(() => PaymentsModule),
        forwardRef(() => PaymentPositionModule),
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
