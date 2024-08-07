import { PaymentType } from './entities/payment-type.entity';
import { AccessTokenGuard } from '@/guards';
import { getUserId } from '@/utils';
import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    getSchemaPath,
} from '@nestjs/swagger';
import { Request } from 'express';
import { CreatePaymentTypeDto } from './dto/create-payment-type.dto';
import { FindAllPaymentTypeDto } from './dto/find-all-payment-type.dto';
import { UpdatePaymentTypeDto } from './dto/update-payment-type.dto';
import { PaymentTypesService } from './payment-types.service';

@Controller('payment-types')
@ApiBearerAuth()
export class PaymentTypesController {
    constructor(private readonly service: PaymentTypesService) {}

    @Post()
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Create a Payment Type record' })
    @ApiCreatedResponse({
        description: 'The record has been successfully created',
        type: PaymentType,
    })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async create(@Req() req: Request, @Body() payload: CreatePaymentTypeDto) {
        const userId = getUserId(req);
        return await this.service.create(userId, payload);
    }

    @Post('find')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        description: 'The found records',
        schema: { type: 'array', items: { $ref: getSchemaPath(PaymentType) } },
    })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async findAll(@Body() payload: FindAllPaymentTypeDto): Promise<PaymentType[]> {
        return await this.service.findAll(payload);
    }

    @Get('id')
    @UseGuards(AccessTokenGuard)
    @ApiOkResponse({ description: 'The found record', type: PaymentType })
    @ApiNotFoundResponse({ description: 'Record not found' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<PaymentType> {
        return await this.service.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Update a Payment Type record' })
    @ApiOkResponse({ description: 'The updated record', type: PaymentType })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Not found' })
    async update(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: number,
        @Body() updatePaymentTypeDto: UpdatePaymentTypeDto,
    ) {
        const userId = getUserId(req);
        return await this.service.update(userId, id, updatePaymentTypeDto);
    }

    @Delete(':id')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Soft delete a Payment Type record' })
    @ApiOkResponse({ description: 'The record has been successfully deleted', type: PaymentType })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Not found' })
    async remove(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
        const userId = getUserId(req);
        return await this.service.remove(userId, id);
    }
}
