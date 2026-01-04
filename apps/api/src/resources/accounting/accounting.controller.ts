import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { AccountingService } from './accounting.service';
import { Accounting } from './entities/accounting.entity';

@Controller('accounting')
export class AccountingController {
    constructor(private readonly accountingService: AccountingService) {}

    @Get()
    @ApiOkResponse({
        description: 'The found records',
        schema: { type: 'array', items: { $ref: getSchemaPath(Accounting) } },
    })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async findAll(): Promise<Accounting[]> {
        return await this.accountingService.findAll();
    }

    @Get(':id')
    @ApiOkResponse({ description: 'The found record', type: Accounting })
    @ApiNotFoundResponse({ description: 'Record not found' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async findOne(@Param('id', ParseIntPipe) id: string): Promise<Accounting> {
        return await this.accountingService.findOne(id);
    }
}
