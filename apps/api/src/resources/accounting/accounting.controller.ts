import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    ParseIntPipe,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
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
    @HttpCode(HttpStatus.OK)
    async create(@Body() createAccountingDto: CreateAccountingDto): Promise<IAccounting> {
        return await this.accountingService.create(createAccountingDto);
    }

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

    @Patch(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateAccountingDto: UpdateAccountingDto,
    ): Promise<IAccounting> {
        return await this.accountingService.update(id, updateAccountingDto);
    }

    @Delete(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async remove(@Param('id', ParseIntPipe) id: number): Promise<IAccounting> {
        return await this.accountingService.remove(id);
    }
}
