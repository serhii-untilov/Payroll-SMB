import { AccessTokenGuard } from '@/guards';
import { getUserId } from '@/utils';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
} from '@nestjs/swagger';
import { Request } from 'express';
import { CreatePayFundTypeDto } from './dto/create-pay-fund-type.dto';
import { UpdatePayFundTypeDto } from './dto/update-pay-fund-type.dto';
import { PayFundType } from './entities/pay-fund-type.entity';
import { PayFundTypesService } from './pay-fund-types.service';

@Controller('pay-fund-types')
@ApiBearerAuth()
export class PayFundTypesController {
    constructor(private readonly service: PayFundTypesService) {}

    @Post()
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Create Pay Fund Type record' })
    @ApiCreatedResponse({
        description: 'The record has been successfully created',
        type: PayFundType,
    })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async create(@Req() req: Request, @Body() payload: CreatePayFundTypeDto) {
        const userId = getUserId(req);
        return await this.service.create(userId, payload);
    }

    @Get()
    @UseGuards(AccessTokenGuard)
    @ApiOkResponse({
        description: 'The found records',
        type: [PayFundType],
    })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async findAll() {
        return await this.service.findAll();
    }

    @Get(':id')
    @UseGuards(AccessTokenGuard)
    @ApiOkResponse({ description: 'The found record', type: PayFundType })
    @ApiNotFoundResponse({ description: 'Record not found' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async findOne(@Req() req: Request, @Param('id') id: string) {
        const userId = getUserId(req);
        return await this.service.findOne(userId, id);
    }

    @Patch(':id/:version')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Update a Pay Fund Type record' })
    @ApiOkResponse({ description: 'The updated record', type: PayFundType })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Not found' })
    async update(
        @Req() req: Request,
        @Param('id') id: string,
        @Param('version', ParseIntPipe) version: number,
        @Body() updateFundTypeDto: UpdatePayFundTypeDto,
    ) {
        const userId = getUserId(req);
        return await this.service.update(userId, id, version, updateFundTypeDto);
    }

    @Delete(':id/:version')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Soft delete a Pay Fund Type record' })
    @ApiOkResponse({ description: 'The record has been successfully deleted', type: PayFundType })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Not found' })
    async remove(@Req() req: Request, @Param('id') id: string, @Param('version', ParseIntPipe) version: number) {
        const userId = getUserId(req);
        return await this.service.remove(userId, id, version);
    }
}
