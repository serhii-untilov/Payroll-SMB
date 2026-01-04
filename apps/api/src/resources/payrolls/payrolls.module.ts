import { Module, forwardRef } from '@nestjs/common';
import { PayrollsService } from './payrolls.service';
import { PayrollsController } from './payrolls.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payroll } from './entities/payroll.entity';
import { PositionsModule } from '../positions/positions.module';
import { AccessModule } from '../access/access.module';
import { CompanyModule } from '../companies/company.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Payroll]),
        forwardRef(() => PositionsModule),
        forwardRef(() => CompanyModule),
        forwardRef(() => AccessModule),
    ],
    controllers: [PayrollsController],
    providers: [PayrollsService],
    exports: [PayrollsService],
})
export class PayrollsModule {}
