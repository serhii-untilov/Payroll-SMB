import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentsController } from './departments.controller';
import { DepartmentsService } from './departments.service';
import { Department } from './entities/department.entity';
import { User } from '../users/entities/user.entity';
import { Company } from '../companies/entities/company.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Department, User, Company])],
    controllers: [DepartmentsController],
    providers: [DepartmentsService],
    exports: [DepartmentsService],
})
export class DepartmentsModule {}
