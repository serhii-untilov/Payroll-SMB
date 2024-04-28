import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { JobsModule } from '../resources/jobs/jobs.module';
import { AuthModule } from '../auth/auth.module';
import { appConfig } from '../config/app.config';
import { authConfig } from '../config/auth.config';
import { dbConfig } from '../config/db.config';
import { googleConfig } from '../config/google.config';
import { TypeormConfigService } from '../config/typeorm-config.service';
import { AccountingModule } from '../resources/accounting/accounting.module';
import { CompaniesModule } from '../resources/companies/companies.module';
import { DepartmentsModule } from '../resources/departments/departments.module';
import { LawsModule } from '../resources/laws/laws.module';
import { PayPeriodsModule } from '../resources/pay-periods/pay-periods.module';
import { PaymentTypesModule } from '../resources/payment-types/payment-types.module';
import { PositionHistoryModule } from '../resources/position-history/position-history.module';
import { PositionsModule } from '../resources/positions/positions.module';
import { RolesModule } from '../resources/roles/roles.module';
import { UsersModule } from '../resources/users/users.module';
import { WorkNormsModule } from '../resources/work-norms/work-norms.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PersonsModule } from '../resources/persons/persons.module';
import { AccessModule } from '../resources/access/access.module';

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
        AuthModule,
        LawsModule,
        RolesModule,
        UsersModule,
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
        AccessModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
