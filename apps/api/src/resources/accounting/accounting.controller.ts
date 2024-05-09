import { Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe } from '@nestjs/common';
import { IAccounting } from '@repo/shared';
import { AccountingService } from './accounting.service';

@Controller('accounting')
export class AccountingController {
    constructor(private readonly accountingService: AccountingService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(): Promise<IAccounting[]> {
        return await this.accountingService.findAll();
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<IAccounting> {
        return await this.accountingService.findOne(id);
    }
}
