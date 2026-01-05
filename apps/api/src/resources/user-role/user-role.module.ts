import { forwardRef, Module } from '@nestjs/common';
import { UserRoleService } from './user-role.service';
import { UserRoleController } from './user-role.controller';
import { UserRole } from './entities/user-role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccessModule } from '../user-access';

@Module({
    imports: [TypeOrmModule.forFeature([UserRole]), forwardRef(() => UserAccessModule)],
    controllers: [UserRoleController],
    providers: [UserRoleService],
    exports: [UserRoleService],
})
export class UserRoleModule {}
