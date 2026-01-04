import { ClosePayPeriodDto, OpenPayPeriodDto } from './dto';
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
import {
    CreatePayPeriodDto,
    FindAllPayPeriodDto,
    FindCurrentPayPeriodDto,
    FindOnePayPeriodDto,
    UpdatePayPeriodDto,
} from './dto';
import { PayPeriod } from './entities';
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
        return await this.service.create(userId, deepTransformToShortDate(payload));
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
    @HttpCode(HttpStatus.OK)
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
    async findOne(@Req() req: Request, @Param('id', ParseIntPipe) id: string, @Body() params: FindOnePayPeriodDto) {
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
    async update(@Req() req: Request, @Param('id', ParseIntPipe) id: string, @Body() payload: UpdatePayPeriodDto) {
        const userId = getUserId(req);
        await this.service.availableUpdateOrFail(userId, id);
        return await this.service.update(userId, id, deepTransformToShortDate(payload));
    }

    @Delete(':id')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Soft delete a Pay Period record' })
    @ApiOkResponse({ description: 'The record has been successfully deleted', type: PayPeriod })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Not found' })
    async remove(@Req() req: Request, @Param('id', ParseIntPipe) id: string) {
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
    async close(@Req() req: Request, @Param('id', ParseIntPipe) id: string, @Body() payload: ClosePayPeriodDto) {
        const userId = getUserId(req);
        await this.service.availableUpdateOrFail(userId, id);
        return await this.service.close(userId, id, payload);
    }

    @Post('open/:id')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Open Pay Period' })
    @ApiCreatedResponse({
        description: 'The Pay Period has been successfully opened',
        type: PayPeriod,
    })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async open(@Req() req: Request, @Param('id', ParseIntPipe) id: string, @Body() payload: OpenPayPeriodDto) {
        const userId = getUserId(req);
        await this.service.availableUpdateOrFail(userId, id);
        return await this.service.open(userId, id, payload);
    }
}
