import { UsersCompanyService } from './users-company.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { UserCompany } from './entities/user-company.entity';
import { AccessModule } from '../access/access.module';
import { RolesModule } from '../roles/roles.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, UserCompany]),
        forwardRef(() => AccessModule),
        forwardRef(() => RolesModule),
    ],
    controllers: [UsersController],
    providers: [UsersService, UsersCompanyService],
    exports: [UsersService, UsersCompanyService],
})
export class UsersModule {}
