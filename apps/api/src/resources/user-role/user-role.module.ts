import { forwardRef, Module } from '@nestjs/common';
import { UserRoleService } from './user-role.service';
import { UserRoleController } from './user-role.controller';
import { UserRole } from './entities/user-role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessModule } from '../access';

@Module({
    imports: [TypeOrmModule.forFeature([UserRole]), forwardRef(() => AccessModule)],
    controllers: [UserRoleController],
    providers: [UserRoleService],
    exports: [UserRoleService],
})
export class UserRoleModule {}
