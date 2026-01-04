import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccessModule } from '../user-access/user-access.module';
import { Role } from './entities/role.entity';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';

@Module({
    imports: [TypeOrmModule.forFeature([Role]), forwardRef(() => UserAccessModule)],
    controllers: [RoleController],
    providers: [RoleService],
    exports: [RoleService],
})
export class RolesModule {}
