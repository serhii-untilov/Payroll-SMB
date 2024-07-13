import { AccessTokenGuard } from '@/guards/accessToken.guard';
import { Payment } from '@/resources/payments/entities/payment.entity';
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
import { FindPaymentDto } from './dto/find-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
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
    @ApiOkResponse({
        description: 'The found records',
        schema: { type: 'array', items: { $ref: getSchemaPath(Payment) } },
    })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async findAll(@Req() req: Request, @Body() params: FindPaymentDto): Promise<Payment[]> {
        const userId = getUserId(req);
        await this.service.availableFindAllOrFail(userId, params.companyId);
        return await this.service.findAll(deepStringToShortDate(params));
    }

    @Get(':id')
    @UseGuards(AccessTokenGuard)
    @ApiOkResponse({ description: 'The found record', type: Payment })
    @ApiNotFoundResponse({ description: 'Record not found' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
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
    @ApiOperation({ summary: 'Update payment' })
    @ApiOkResponse({ description: 'The updated record', type: Payment })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Not found' })
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
    @ApiOperation({ summary: 'Soft delete a payment record' })
    @ApiOkResponse({ description: 'The record has been successfully deleted', type: Payment })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Not found' })
    async remove(@Req() req: Request, @Param('id', ParseIntPipe) id: number): Promise<Payment> {
        const userId = getUserId(req);
        await this.service.availableDeleteOrFail(userId, id);
        return await this.service.remove(userId, id);
    }

    @Post('process/:id')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Process payment' })
    @ApiOkResponse({
        description: 'The Payment has been successfully processed',
        type: Payment,
    })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiBadRequestResponse({ description: 'Bad request' })
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
    @ApiOperation({ summary: 'Withdraw payment' })
    @ApiOkResponse({
        description: 'The Payment has been successfully withdraw',
        type: Payment,
    })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiBadRequestResponse({ description: 'Bad request' })
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
