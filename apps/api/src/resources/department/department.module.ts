import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccessModule } from '../user-access/user-access.module';
import { DepartmentController } from './department.controller';
import { DepartmentService } from './department.service';
import { DepartmentEntity } from './entities/department.entity';
import { DepartmentMapper } from './mappers/department.mapper';

@Module({
    imports: [TypeOrmModule.forFeature([DepartmentEntity]), forwardRef(() => UserAccessModule)],
    controllers: [DepartmentController],
    providers: [DepartmentService, DepartmentMapper],
    exports: [DepartmentService],
})
export class DepartmentModule {}
