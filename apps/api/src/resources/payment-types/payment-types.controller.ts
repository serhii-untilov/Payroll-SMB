import { AccessTokenGuard } from '@/guards/accessToken.guard';
import { PaymentType } from '@/resources/payment-types/entities/payment-type.entity';
import { getUserId } from '@/utils/getUserId';
import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
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

    @Get()
    @UseGuards(AccessTokenGuard)
    @ApiOkResponse({
        description: 'The found records',
        schema: { type: 'array', items: { $ref: getSchemaPath(PaymentType) } },
    })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async findAll(
        @Query('part') part: string,
        @Query('groups') groups: string,
        @Query('methods') methods: string,
        @Query('ids') ids: string,
    ) {
        return await this.service.findAll({
            part,
            groups: groups ? JSON.parse(decodeURIComponent(groups)) : null,
            methods: methods ? JSON.parse(decodeURIComponent(methods)) : null,
            ids: ids ? JSON.parse(decodeURIComponent(ids)) : null,
        });
    }

    @Get(':id')
    @UseGuards(AccessTokenGuard)
    @ApiOkResponse({ description: 'The found record', type: PaymentType })
    @ApiNotFoundResponse({ description: 'Record not found' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return await this.service.findOne({
            where: { id },
            relations: {
                law: true,
                accounting: true,
            },
        });
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
