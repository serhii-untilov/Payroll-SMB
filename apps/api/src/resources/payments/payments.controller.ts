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
import { AccessTokenGuard } from './../../guards/accessToken.guard';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Payment } from './entities/payment.entity';
import { PaymentsService } from './payments.service';
import { FindPaymentDto } from './dto/find-payment.dto';
import { getUserId } from './../../utils/getUserId';

@Controller('payments')
export class PaymentsController {
    constructor(private readonly service: PaymentsService) {}

    @Post()
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async create(@Req() req: Request, @Body() payload: CreatePaymentDto): Promise<Payment> {
        const userId = getUserId(req);
        const companyId = await this.service.getCompanyId(payload.companyId);
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
    ): Promise<Payment> {
        const userId = getUserId(req);
        const found = await this.service.findOne(id, relations);
        await this.service.availableFindOneOrFail(userId, found.companyId);
        return found;
    }

    @Patch(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async update(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: UpdatePaymentDto,
    ): Promise<Payment> {
        const userId = getUserId(req);
        await this.service.availableUpdateOrFail(userId, id);
        return await this.service.update(userId, id, deepStringToShortDate(payload));
    }

    @Delete(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async remove(@Req() req: Request, @Param('id', ParseIntPipe) id: number): Promise<Payment> {
        const userId = getUserId(req);
        await this.service.availableDeleteOrFail(userId, id);
        return await this.service.remove(userId, id);
    }

    @Post('find')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findAll(@Req() req: Request, @Body() params: FindPaymentDto): Promise<Payment[]> {
        const userId = getUserId(req);
        await this.service.availableFindAllOrFail(userId, params.companyId);
        return await this.service.findAll(deepStringToShortDate(params));
    }

    @Post('process/:id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async process(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: number,
        @Body() params: { version: number },
    ): Promise<Payment> {
        const userId = getUserId(req);
        await this.service.availableUpdateOrFail(userId, id);
        return this.service.process(userId, id, params.version);
    }

    @Post('withdraw/:id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async withdraw(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: number,
        @Body() params: { version: number },
    ): Promise<Payment> {
        const userId = getUserId(req);
        await this.service.availableUpdateOrFail(userId, id);
        return this.service.withdraw(userId, id, params.version);
    }
}
