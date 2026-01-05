import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentsController } from './departments.controller';
import { DepartmentsService } from './department.service';
import { DepartmentEntity } from './entities/department.entity';
import { UserAccessModule } from '../user-access';

@Module({
    imports: [TypeOrmModule.forFeature([DepartmentEntity]), forwardRef(() => UserAccessModule)],
    controllers: [DepartmentsController],
    providers: [DepartmentsService],
    exports: [DepartmentsService],
})
export class DepartmentsModule {}
