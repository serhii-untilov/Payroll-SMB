import { AuthModule } from '@/auth/auth.module';
import { appConfig, authConfig, dbConfig, googleConfig, TypeormConfigService } from '@/config';
import {
    AccessModule,
    AccountingModule,
    CompaniesModule,
    DepartmentsModule,
    JobsModule,
    LawsModule,
    MinWageModule,
    PayFundsModule,
    PayFundTypesModule,
    PaymentPositionsModule,
    PaymentsModule,
    PaymentTypesModule,
    PayPeriodsModule,
    PayrollsModule,
    PersonsModule,
    PositionHistoryModule,
    PositionsModule,
    RolesModule,
    TasksModule,
    UserCompaniesModule,
    UsersModule,
    WorkNormsModule,
} from '@/resources';
import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ErrorsInterceptor } from '@/interceptors/errors.interceptor';
import { SnowflakeModule } from '@/snowflake/snowflake.module';
import { SnowflakeServiceSingleton } from '@/snowflake/snowflake.singleton';

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
        SnowflakeModule,
        ScheduleModule.forRoot(),
        AccessModule,
        AccountingModule,
        AuthModule,
        CompaniesModule,
        DepartmentsModule,
        JobsModule,
        LawsModule,
        MinWageModule,
        PayFundsModule,
        PayFundTypesModule,
        PaymentTypesModule,
        PayPeriodsModule,
        PaymentsModule,
        PaymentPositionsModule,
        PayrollsModule,
        PersonsModule,
        PositionHistoryModule,
        PositionsModule,
        RolesModule,
        TasksModule,
        UserCompaniesModule,
        UsersModule,
        WorkNormsModule,
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
        SnowflakeServiceSingleton.init({
            workerId: Number(process.env.SNOWFLAKE_WORKER_ID ?? 0),
            epoch: 1577836800000,
        });
    }
}
