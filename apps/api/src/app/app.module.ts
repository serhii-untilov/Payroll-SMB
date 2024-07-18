import { AuthModule } from '@/auth/auth.module';
import { appConfig, authConfig, dbConfig, googleConfig, TypeormConfigService } from '@/config';
import { AccessModule } from '@/resources/access/access.module';
import { AccountingModule } from '@/resources/accounting/accounting.module';
import { CompaniesModule } from '@/resources/companies/companies.module';
import { DepartmentsModule } from '@/resources/departments/departments.module';
import { JobsModule } from '@/resources/jobs/jobs.module';
import { LawsModule } from '@/resources/laws/laws.module';
import { MinWageModule } from '@/resources/min-wage/min-wage.module';
import { PayFundTypesModule } from '@/resources/pay-fund-types/pay-fund-types.module';
import { PayFundsModule } from '@/resources/pay-funds/pay-funds.module';
import { PayPeriodsModule } from '@/resources/pay-periods/pay-periods.module';
import { PaymentTypesModule } from '@/resources/payment-types/payment-types.module';
import { PayrollsModule } from '@/resources/payrolls/payrolls.module';
import { PersonsModule } from '@/resources/persons/persons.module';
import { PositionHistoryModule } from '@/resources/position-history/position-history.module';
import { PositionsModule } from '@/resources/positions/positions.module';
import { RolesModule } from '@/resources/roles/roles.module';
import { TasksModule } from '@/resources/tasks/tasks.module';
import { UsersModule } from '@/resources/users/users.module';
import { WorkNormsModule } from '@/resources/work-norms/work-norms.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';

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
        PayrollsModule,
        PersonsModule,
        PositionHistoryModule,
        PositionsModule,
        RolesModule,
        TasksModule,
        UsersModule,
        WorkNormsModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
