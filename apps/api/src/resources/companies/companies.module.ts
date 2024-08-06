import { ProcessorModule } from '@/processor/processor.module';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessModule } from '../access/access.module';
import { UsersModule } from '../users/users.module';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { Company } from './entities/company.entity';
import { UserCompaniesModule } from '../user-companies';

@Module({
    imports: [
        TypeOrmModule.forFeature([Company]),
        forwardRef(() => UsersModule),
        forwardRef(() => UserCompaniesModule),
        forwardRef(() => AccessModule),
        forwardRef(() => ProcessorModule),
    ],
    controllers: [CompaniesController],
    providers: [CompaniesService],
    exports: [CompaniesService],
})
export class CompaniesModule {}
