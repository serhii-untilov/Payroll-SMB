import { AccessTokenGuard } from '@/guards/accessToken.guard';
import { getUserId } from '@/utils/getUserId';
import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseBoolPipe,
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
import { deepStringToShortDate } from '@repo/shared';
import { Request } from 'express';
import { CreatePaymentPositionDto } from './dto/create-paymentPosition.dto';
import { FindPaymentPositionDto } from './dto/find-paymentPosition.dto';
import { UpdatePaymentPositionDto } from './dto/update-paymentPosition.dto';
import { PaymentPosition } from './entities/paymentPosition.entity';
import { PaymentPositionsService } from './payment-positions.service';

@Controller('payment-positions')
@ApiBearerAuth()
export class PaymentPositionsController {
    constructor(private readonly service: PaymentPositionsService) {}

    @Post()
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Create a Payment Position record' })
    @ApiCreatedResponse({
        description: 'The record has been successfully created',
        type: PaymentPosition,
    })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async create(
        @Req() req: Request,
        @Body() payload: CreatePaymentPositionDto,
    ): Promise<PaymentPosition> {
        const userId = getUserId(req);
        const companyId = await this.service.getCompanyId(payload.paymentId);
        await this.service.availableCreateOrFail(userId, companyId);
        return await this.service.create(userId, deepStringToShortDate(payload));
    }

    @Post('find')
    @UseGuards(AccessTokenGuard)
    @ApiOkResponse({
        description: 'The found records',
        schema: { type: 'array', items: { $ref: getSchemaPath(PaymentPosition) } },
    })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async findAll(
        @Req() req: Request,
        @Body() params: FindPaymentPositionDto,
    ): Promise<PaymentPosition[]> {
        const userId = getUserId(req);
        const companyId = await this.service.getPaymentCompanyId(params.paymentId);
        await this.service.availableFindAllOrFail(userId, companyId);
        return await this.service.findAll(deepStringToShortDate(params));
    }

    @Get(':id')
    @UseGuards(AccessTokenGuard)
    @ApiOkResponse({ description: 'The found record', type: PaymentPosition })
    @ApiNotFoundResponse({ description: 'Record not found' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async findOne(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: number,
        @Query('relations', ParseBoolPipe) relations: boolean,
    ): Promise<PaymentPosition> {
        const userId = getUserId(req);
        await this.service.availableFindOneOrFail(userId, id);
        return await this.service.findOne(id, relations);
    }

    @Patch(':id')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Update a Payment Position record' })
    @ApiOkResponse({ description: 'The updated record', type: PaymentPosition })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Not found' })
    async update(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: UpdatePaymentPositionDto,
    ): Promise<PaymentPosition> {
        const userId = getUserId(req);
        await this.service.availableUpdateOrFail(userId, id);
        return await this.service.update(userId, id, deepStringToShortDate(payload));
    }

    @Delete(':id')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Soft delete a Payment Position record' })
    @ApiOkResponse({
        description: 'The record has been successfully deleted',
        type: PaymentPosition,
    })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Not found' })
    async remove(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<PaymentPosition> {
        const userId = getUserId(req);
        await this.service.availableDeleteOrFail(userId, id);
        return await this.service.remove(userId, id);
    }
}
