import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesModule } from '../role/role.module';
import { UserAccessModule } from '../user-access/user-access.module';
import { UserRoleModule } from '../user-role/user-role.module';
import { UserModule } from '../user/user.module';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { CompanyEntity } from './entities/company.entity';
import { CompanyMapper } from './mappers/company.mapper';

@Module({
    imports: [
        TypeOrmModule.forFeature([CompanyEntity]),
        forwardRef(() => UserModule),
        forwardRef(() => RolesModule),
        forwardRef(() => UserRoleModule),
        forwardRef(() => UserAccessModule),
    ],
    controllers: [CompanyController],
    providers: [CompanyService, CompanyMapper],
    exports: [CompanyService],
})
export class CompanyModule {}
