import { Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe } from '@nestjs/common';
import { AccountingService } from './accounting.service';
import { Accounting } from './entities/accounting.entity';

@Controller('accounting')
export class AccountingController {
    constructor(private readonly accountingService: AccountingService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(): Promise<Accounting[]> {
        return await this.accountingService.findAll();
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<Accounting> {
        return await this.accountingService.findOne(id);
    }
}
