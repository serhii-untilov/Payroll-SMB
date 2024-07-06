import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseBoolPipe,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { deepStringToShortDate } from '@repo/shared';
import { Request } from 'express';
import { AccessTokenGuard } from './../../../guards/accessToken.guard';
import { CreatePaymentPositionDto } from './dto/create-paymentPosition.dto';
import { FindPaymentPositionDto } from './dto/find-paymentPosition.dto';
import { UpdatePaymentPositionDto } from './dto/update-paymentPosition.dto';
import { PaymentPosition } from './entities/paymentPosition.entity';

import { PaymentPositionsService } from './payment-positions.service';
import { getUserId } from './../../../utils/getUserId';

@Controller('payment-positions')
export class PaymentPositionsController {
    constructor(private readonly service: PaymentPositionsService) {}

    @Post()
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async create(
        @Req() req: Request,
        @Body() payload: CreatePaymentPositionDto,
    ): Promise<PaymentPosition> {
        const userId = getUserId(req);
        const companyId = await this.service.getCompanyId(payload.paymentId);
        await this.service.availableCreateOrFail(userId, companyId);
        return await this.service.create(userId, deepStringToShortDate(payload));
    }

    @Get(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
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
    @HttpCode(HttpStatus.OK)
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
    @HttpCode(HttpStatus.OK)
    async remove(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<PaymentPosition> {
        const userId = getUserId(req);
        await this.service.availableDeleteOrFail(userId, id);
        return await this.service.remove(userId, id);
    }

    @Post('find')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findAll(
        @Req() req: Request,
        @Body() params: FindPaymentPositionDto,
    ): Promise<PaymentPosition[]> {
        const userId = getUserId(req);
        const companyId = await this.service.getPaymentCompanyId(params.paymentId);
        await this.service.availableFindAllOrFail(userId, companyId);
        return await this.service.findAll(deepStringToShortDate(params));
    }
}
