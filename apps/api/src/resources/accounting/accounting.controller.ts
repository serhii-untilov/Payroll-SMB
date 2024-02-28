import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AccountingService } from './accounting.service';
import { CreateAccountingDto } from './dto/create-accounting.dto';
import { UpdateAccountingDto } from './dto/update-accounting.dto';
import { IAccounting } from '@repo/shared';
import { AccessTokenGuard } from '../../guards/accessToken.guard';

@Controller('accounting')
export class AccountingController {
    constructor(private readonly accountingService: AccountingService) {}

    @Post()
    @UseGuards(AccessTokenGuard)
    async create(@Body() createAccountingDto: CreateAccountingDto): Promise<IAccounting> {
        return await this.accountingService.create(createAccountingDto);
    }

    @Get()
    @UseGuards(AccessTokenGuard)
    async findAll(): Promise<IAccounting[]> {
        return await this.accountingService.findAll();
    }

    @Get(':id')
    @UseGuards(AccessTokenGuard)
    async findOne(@Param('id') id: string): Promise<IAccounting> {
        return await this.accountingService.findOne(+id);
    }

    @Patch(':id')
    @UseGuards(AccessTokenGuard)
    async update(
        @Param('id') id: string,
        @Body() updateAccountingDto: UpdateAccountingDto,
    ): Promise<IAccounting> {
        return await this.accountingService.update(+id, updateAccountingDto);
    }

    @Delete(':id')
    @UseGuards(AccessTokenGuard)
    async remove(@Param('id') id: string): Promise<IAccounting> {
        return await this.accountingService.remove(+id);
    }
}
