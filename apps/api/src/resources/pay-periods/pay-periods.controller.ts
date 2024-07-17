import { AccessTokenGuard } from '@/guards/accessToken.guard';
import { PayPeriod } from '@/resources/pay-periods/entities/pay-period.entity';
import { getUserId } from '@/utils/getUserId';
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
import { CreatePayPeriodDto } from './dto/create-pay-period.dto';
import { FindAllPayPeriodDto } from './dto/find-all-pay-period.dto';
import { FindCurrentPayPeriodDto } from './dto/find-current-pay-period.dto';
import { FindOnePayPeriodDto } from './dto/find-one-pay-period.dto';
import { UpdatePayPeriodDto } from './dto/update-pay-period.dto';
import { PayPeriodsService } from './pay-periods.service';

@Controller('pay-periods')
@ApiBearerAuth()
export class PayPeriodsController {
    constructor(private readonly service: PayPeriodsService) {}

    @Post()
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Create a Pay Period record' })
    @ApiCreatedResponse({
        description: 'The record has been successfully created',
        type: PayPeriod,
    })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async create(@Req() req: Request, @Body() payload: CreatePayPeriodDto) {
        const userId = getUserId(req);
        await this.service.availableCreateOrFail(userId, payload.companyId);
        return await this.service.create(userId, deepStringToShortDate(payload));
    }

    @Post('find')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        description: 'The found records',
        schema: { type: 'array', items: { $ref: getSchemaPath(PayPeriod) } },
    })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async findAll(@Req() req: Request, @Body() params: FindAllPayPeriodDto) {
        const userId = getUserId(req);
        params.companyId && (await this.service.availableFindAllOrFail(userId, params.companyId));
        return await this.service.findAll(params);
    }

    @Post('current')
    @UseGuards(AccessTokenGuard)
    @ApiOkResponse({ description: 'The found record', type: PayPeriod })
    @ApiNotFoundResponse({ description: 'Record not found' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async findCurrent(@Req() req: Request, @Body() params: FindCurrentPayPeriodDto) {
        const userId = getUserId(req);
        if (params?.companyId) {
            await this.service.availableFindAllOrFail(userId, params.companyId);
        }
        return await this.service.findCurrent(userId, params);
    }

    @Post('find/:id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ description: 'The found record', type: PayPeriod })
    @ApiNotFoundResponse({ description: 'Record not found' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async findOne(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: number,
        @Body() params: FindOnePayPeriodDto,
    ) {
        const userId = getUserId(req);
        await this.service.availableFindOneOrFail(userId, id);
        return await this.service.findOne(id, params);
    }

    @Patch(':id')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Update a Pay Period record' })
    @ApiOkResponse({ description: 'The updated record', type: PayPeriod })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Not found' })
    async update(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: UpdatePayPeriodDto,
    ) {
        const userId = getUserId(req);
        await this.service.availableUpdateOrFail(userId, id);
        return await this.service.update(userId, id, deepStringToShortDate(payload));
    }

    @Delete(':id')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Soft delete a Pay Period record' })
    @ApiOkResponse({ description: 'The record has been successfully deleted', type: PayPeriod })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Not found' })
    async remove(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
        const userId = getUserId(req);
        await this.service.availableDeleteOrFail(userId, id);
        return await this.service.remove(userId, id);
    }

    @Post('close/:id')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Close Pay Period' })
    @ApiCreatedResponse({
        description: 'The Pay Period has been successfully closed',
        type: PayPeriod,
    })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async close(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: { version: number },
    ) {
        const userId = getUserId(req);
        await this.service.availableUpdateOrFail(userId, id);
        return await this.service.close(userId, id, payload.version);
    }

    @Post('open/:id')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Open Pay Period' })
    @ApiCreatedResponse({
        description: 'The Pay Period has been successfully opened',
        type: PayPeriod,
    })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async open(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: { version: number },
    ) {
        const userId = getUserId(req);
        await this.service.availableUpdateOrFail(userId, id);
        return await this.service.open(userId, id, payload.version);
    }
}
