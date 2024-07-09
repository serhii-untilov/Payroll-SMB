import { AuthModule } from '@/auth/auth.module';
import { appConfig } from '@/config/app.config';
import { authConfig } from '@/config/auth.config';
import { dbConfig } from '@/config/db.config';
import { googleConfig } from '@/config/google.config';
import { TypeormConfigService } from '@/config/typeorm-config.service';
import { AccessModule } from '@/resources/access/access.module';
import { AccountingModule } from '@/resources/accounting/accounting.module';
import { CompaniesModule } from '@/resources/companies/companies.module';
import { DepartmentsModule } from '@/resources/departments/departments.module';
import { JobsModule } from '@/resources/jobs/jobs.module';
import { LawsModule } from '@/resources/laws/laws.module';
import { PayPeriodsModule } from '@/resources/pay-periods/payPeriods.module';
import { PaymentTypesModule } from '@/resources/payment-types/payment-types.module';
import { PersonsModule } from '@/resources/persons/persons.module';
import { PositionHistoryModule } from '@/resources/position-history/position-history.module';
import { PositionsModule } from '@/resources/positions/positions.module';
import { RolesModule } from '@/resources/roles/roles.module';
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
            // show event name in memory leak message when more than maximum amount of listeners is assigned
            verboseMemoryLeak: false,
            // disable throwing uncaughtException if an error event is emitted and it has no listeners
            ignoreErrors: false,
        }),
        AuthModule,
        LawsModule,
        RolesModule,
        UsersModule,
        AccessModule,
        AccountingModule,
        CompaniesModule,
        DepartmentsModule,
        JobsModule,
        PaymentTypesModule,
        WorkNormsModule,
        PayPeriodsModule,
        PersonsModule,
        PositionsModule,
        PositionHistoryModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
