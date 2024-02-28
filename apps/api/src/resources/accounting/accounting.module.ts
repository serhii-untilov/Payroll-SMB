import { Module } from '@nestjs/common';
import { AccountingService } from './accounting.service';
import { AccountingController } from './accounting.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Accounting } from './entities/accounting.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Accounting])],
    controllers: [AccountingController],
    providers: [AccountingService],
    exports: [AccountingService],
})
export class AccountingModule {}
