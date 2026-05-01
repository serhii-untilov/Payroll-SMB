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
    getSchemaPath,
} from '@nestjs/swagger';
import { deepTransformToShortDate } from '@repo/shared';
import { Request } from 'express';
import { CreatePaymentPositionDto } from './dto/create-payment-position.dto';
import { FindAllPaymentPositionDto } from './dto/find-all-payment-position.dto';
import { UpdatePaymentPositionDto } from './dto/update-payment-position.dto';
import { PaymentPosition } from './entities/paymentPosition.entity';
import { PaymentPositionService } from './payment-position.service';
import { FindOnePaymentPositionDto } from './dto';

@Controller('payment-positions')
@ApiBearerAuth()
export class PaymentPositionController {
    constructor(private readonly service: PaymentPositionService) {}

    @Post()
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Create a Payment Position record' })
    @ApiCreatedResponse({
        description: 'The record has been successfully created',
        type: PaymentPosition,
    })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async create(@Req() req: Request, @Body() payload: CreatePaymentPositionDto): Promise<PaymentPosition> {
        const userId = getUserId(req);
        return await this.service.create(userId, deepTransformToShortDate(payload));
    }

    @Post('list')
    @UseGuards(AccessTokenGuard)
    @ApiOkResponse({
        description: 'The found records',
        schema: { type: 'array', items: { $ref: getSchemaPath(PaymentPosition) } },
    })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async findAll(@Body() params: FindAllPaymentPositionDto): Promise<PaymentPosition[]> {
        return await this.service.findAll(deepTransformToShortDate(params));
    }

    @Get(':id')
    @UseGuards(AccessTokenGuard)
    @ApiOkResponse({ description: 'The found record', type: PaymentPosition })
    @ApiNotFoundResponse({ description: 'Record not found' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async findOne(@Req() req: Request, @Param('id') id: string, @Body() params: FindOnePaymentPositionDto) {
        const userId = getUserId(req);
        return await this.service.findOne(userId, id, params);
    }

    @Patch(':id/:version')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Update a Payment Position record' })
    @ApiOkResponse({ description: 'The updated record', type: PaymentPosition })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Not found' })
    async update(
        @Req() req: Request,
        @Param('id') id: string,
        @Param('version', ParseIntPipe) version: number,
        @Body() payload: UpdatePaymentPositionDto,
    ) {
        const userId = getUserId(req);
        return await this.service.update(userId, id, version, payload);
    }

    @Delete(':id/:version')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Soft delete a Payment Position record' })
    @ApiOkResponse({ description: 'The record has been successfully deleted', type: PaymentPosition })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Not found' })
    async remove(@Req() req: Request, @Param('id') id: string, @Param('version', ParseIntPipe) version: number) {
        const userId = getUserId(req);
        return await this.service.remove(userId, id, version);
    }
}
