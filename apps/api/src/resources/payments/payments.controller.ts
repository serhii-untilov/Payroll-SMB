import { Payment } from './entities/payment.entity';
import { AccessTokenGuard } from '@/guards';
import { getUserId } from '@/utils';
import {
    Body,
    Controller,
    Delete,
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
    ApiBadRequestResponse,
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
import { CreatePaymentDto } from './dto/create-payment.dto';
import { FindAllPaymentDto } from './dto/find-all-payment.dto';
import { FindOnePaymentDto } from './dto/find-one-payment.dto';
import { ProcessPaymentDto } from './dto/process-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { WithdrawPaymentDto } from './dto/withdraw-payment.dto';
import { PaymentsService } from './payments.service';

@Controller('payments')
@ApiBearerAuth()
export class PaymentsController {
    constructor(private readonly service: PaymentsService) {}

    @Post()
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Create payment' })
    @ApiCreatedResponse({
        description: 'The record has been successfully created',
        type: Payment,
    })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async create(@Req() req: Request, @Body() payload: CreatePaymentDto): Promise<Payment> {
        const userId = getUserId(req);
        const companyId = await this.service.getCompanyId(payload.companyId);
        await this.service.availableCreateOrFail(userId, companyId);
        return await this.service.create(userId, deepStringToShortDate(payload));
    }

    @Post('find')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        description: 'The found records',
        schema: { type: 'array', items: { $ref: getSchemaPath(Payment) } },
    })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async findAll(@Req() req: Request, @Body() params: FindAllPaymentDto): Promise<Payment[]> {
        const userId = getUserId(req);
        await this.service.availableFindAllOrFail(userId, params.companyId);
        return await this.service.findAll(deepStringToShortDate(params));
    }

    @Post('find/:id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ description: 'The found record', type: Payment })
    @ApiNotFoundResponse({ description: 'Record not found' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async findOne(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: string,
        @Body() params: FindOnePaymentDto,
    ): Promise<Payment> {
        const userId = getUserId(req);
        const found = await this.service.findOne(id, params);
        await this.service.availableFindOneOrFail(userId, found.companyId);
        return found;
    }

    @Patch(':id')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Update payment' })
    @ApiOkResponse({ description: 'The updated record', type: Payment })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Not found' })
    async update(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: string,
        @Body() payload: UpdatePaymentDto,
    ): Promise<Payment> {
        const userId = getUserId(req);
        await this.service.availableUpdateOrFail(userId, id);
        return await this.service.update(userId, id, deepStringToShortDate(payload));
    }

    @Delete(':id')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Soft delete a payment record' })
    @ApiOkResponse({ description: 'The record has been successfully deleted', type: Payment })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Not found' })
    async remove(@Req() req: Request, @Param('id', ParseIntPipe) id: string): Promise<Payment> {
        const userId = getUserId(req);
        await this.service.availableDeleteOrFail(userId, id);
        return await this.service.remove(userId, id);
    }

    @Post('restore/:id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Restore the deleted payment record' })
    @ApiOkResponse({ description: 'The record has been successfully restored', type: Payment })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Not found' })
    @ApiBadRequestResponse({ description: 'Bad request' })
    async restore(@Req() req: Request, @Param('id', ParseIntPipe) id: string): Promise<Payment> {
        const userId = getUserId(req);
        await this.service.availableUpdateOrFail(userId, id);
        return await this.service.restore(userId, id);
    }

    @Post('process/:id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Process payment' })
    @ApiOkResponse({
        description: 'The Payment has been successfully processed',
        type: Payment,
    })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiBadRequestResponse({ description: 'Bad request' })
    async process(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: string,
        @Body() params: ProcessPaymentDto,
    ): Promise<Payment> {
        const userId = getUserId(req);
        await this.service.availableUpdateOrFail(userId, id);
        return this.service.process(userId, id, params);
    }

    @Post('withdraw/:id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Withdraw payment' })
    @ApiOkResponse({
        description: 'The Payment has been successfully withdraw',
        type: Payment,
    })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiBadRequestResponse({ description: 'Bad request' })
    async withdraw(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: string,
        @Body() params: WithdrawPaymentDto,
    ): Promise<Payment> {
        const userId = getUserId(req);
        await this.service.availableUpdateOrFail(userId, id);
        return this.service.withdraw(userId, id, params);
    }
}
