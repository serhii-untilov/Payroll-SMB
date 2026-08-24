import { AuthModule } from '@/auth/auth.module';
import { appConfig, authConfig, dbConfig, googleConfig, TypeormConfigService } from '@/config';
import { ErrorsInterceptor } from '@/interceptors/errors.interceptor';
import { SnowflakeModule } from '@/snowflake/snowflake.module';
import { IdGenerator } from '@/snowflake/snowflake.singleton';
import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountingModule } from '../resources/accounting/accounting.module';
import { CompanyModule } from '../resources/company/company.module';
import { DepartmentModule } from '../resources/department/department.module';
import { JobModule } from '../resources/job/job.module';
import { LawsModule } from '../resources/laws/laws.module';
import { MinWageModule } from '../resources/min-wage/min-wage.module';
import { PayFundModule } from '../resources/pay-fund/pay-fund.module';
import { PayFundTypesModule } from '../resources/pay-fund-types/pay-fund-types.module';
import { PaymentPositionModule } from '../resources/payment-position/payment-position.module';
import { PaymentsModule } from '../resources/payments/payments.module';
import { PaymentTypeModule } from '../resources/payment-type/payment-type.module';
import { PayPeriodModule } from '../resources/pay-period/pay-period.module';
import { PayrollsModule } from '../resources/payrolls/payrolls.module';
import { PersonModule } from '../resources/person/person.module';
import { PositionHistoryModule } from '../resources/position-history/position-history.module';
import { PositionsModule } from '../resources/positions/positions.module';
import { RolesModule } from '../resources/role/role.module';
import { TasksModule } from '../resources/tasks/tasks.module';
import { UserAccessModule } from '../resources/user-access/user-access.module';
import { UserModule } from '../resources/user/user.module';
import { UserRoleModule } from '../resources/user-role/user-role.module';
import { WorkTimeNormModule } from '../resources/work-time-norm/work-time-norm.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['.env.local', '.env', '.env.development', '.env.production'],
            ignoreEnvVars: true,
            // ignoreEnvFile: true,
            load: [appConfig, dbConfig, authConfig, googleConfig],
        }),
        TypeOrmModule.forRootAsync({
            useClass: TypeormConfigService,
            inject: [ConfigService],
        }),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '../../..', 'web', 'dist'),
            exclude: ['/api/(.*)'],
        }),
        EventEmitterModule.forRoot({
            // set this to `true` to use wildcards
            wildcard: false,
            // the delimiter used to segment namespaces
            delimiter: '.',
            // set this to `true` if you want to emit the newListener event
            newListener: false,
            // set this to `true` if you want to emit the removeListener event
            removeListener: false,
            // the maximum amount of listeners that can be assigned to an event
            maxListeners: 10,
            // show event name in memory leak message when more than maximum
            // amount of listeners is assigned
            verboseMemoryLeak: false,
            // disable throwing uncaughtException if an error event is emitted
            // and it has no listeners
            ignoreErrors: false,
        }),
        AccountingModule,
        AuthModule,
        CompanyModule,
        DepartmentModule,
        JobModule,
        LawsModule,
        MinWageModule,
        PayFundModule,
        PayFundTypesModule,
        PaymentPositionModule,
        PaymentsModule,
        PaymentTypeModule,
        PayPeriodModule,
        PayrollsModule,
        PersonModule,
        PositionHistoryModule,
        PositionsModule,
        RolesModule,
        ScheduleModule.forRoot(),
        SnowflakeModule,
        TasksModule,
        UserAccessModule,
        UserModule,
        UserRoleModule,
        WorkTimeNormModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_INTERCEPTOR,
            useClass: ErrorsInterceptor,
        },
    ],
})
export class AppModule implements OnModuleInit {
    onModuleInit() {
        // Why OnModuleInit?
        // Runs once per process
        // Runs before controllers / services handle requests
        // Perfect place for global initialization
        IdGenerator.init({
            workerId: Number(process.env.SNOWFLAKE_WORKER_ID ?? 0),
            epoch: 1577836800000,
        });
    }
}
