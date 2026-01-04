import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesModule } from '../role';
import { UserRoleModule } from '../user-role';
import { UserModule } from '../user/user.module';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { CompanyEntity } from './entities/company.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([CompanyEntity]),
        forwardRef(() => UserModule),
        forwardRef(() => RolesModule),
        forwardRef(() => UserRoleModule),
    ],
    controllers: [CompanyController],
    providers: [CompanyService],
    exports: [CompanyService],
})
export class CompanyModule {}
