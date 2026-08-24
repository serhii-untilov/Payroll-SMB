import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesModule } from '../role/role.module';
import { UserAccessModule } from '../user-access/user-access.module';
import { UserRole } from '../user-role/entities/user-role.entity';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, UserRole]),
        forwardRef(() => UserAccessModule),
        forwardRef(() => RolesModule),
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
