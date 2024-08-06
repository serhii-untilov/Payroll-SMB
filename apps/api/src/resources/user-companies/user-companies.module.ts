import { forwardRef, Module } from '@nestjs/common';
import { UserCompaniesService } from './user-companies.service';
import { UserCompaniesController } from './user-companies.controller';
import { UserCompany } from './entities/user-company.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessModule } from '../access';

@Module({
    imports: [TypeOrmModule.forFeature([UserCompany]), forwardRef(() => AccessModule)],
    controllers: [UserCompaniesController],
    providers: [UserCompaniesService],
    exports: [UserCompaniesService],
})
export class UserCompaniesModule {}
