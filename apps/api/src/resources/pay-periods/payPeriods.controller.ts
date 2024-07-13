import { AccessTokenGuard } from '@/guards/accessToken.guard';
import { PayPeriod } from '@/resources/pay-periods/entities/payPeriod.entity';
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
import { CreatePayPeriodDto } from './dto/createPayPeriod.dto';
import { UpdatePayPeriodDto } from './dto/updatePayPeriod.dto';
import { defaultFieldList } from './entities/payPeriod.entity';
import { PayPeriodsService } from './payPeriods.service';

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

    @Get()
    @UseGuards(AccessTokenGuard)
    @ApiOkResponse({
        description: 'The found records',
        schema: { type: 'array', items: { $ref: getSchemaPath(PayPeriod) } },
    })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async findAll(
        @Req() req: Request,
        @Query('companyId', new ParseIntPipe({ optional: true })) companyId: number,
        @Query('relations', new ParseBoolPipe({ optional: true })) relations: boolean,
        @Query('fullFieldList', new ParseBoolPipe({ optional: true })) fullFieldList: boolean,
    ) {
        const userId = getUserId(req);
        companyId && (await this.service.availableFindAllOrFail(userId, companyId));
        return await this.service.findAll(companyId, relations, fullFieldList);
    }

    @Get('current')
    @UseGuards(AccessTokenGuard)
    @ApiOkResponse({ description: 'The found record', type: PayPeriod })
    @ApiNotFoundResponse({ description: 'Record not found' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async findCurrent(
        @Req() req: Request,
        @Query('companyId', ParseIntPipe) companyId: number,
        @Query('relations', ParseBoolPipe) relations: boolean,
        @Query('fullFieldList', ParseBoolPipe) fullFieldList: boolean,
    ) {
        const userId = getUserId(req);
        await this.service.availableFindAllOrFail(userId, companyId);
        return await this.service.findCurrent(userId, companyId, !!relations, !!fullFieldList);
    }

    @Get(':id')
    @UseGuards(AccessTokenGuard)
    @ApiOkResponse({ description: 'The found record', type: PayPeriod })
    @ApiNotFoundResponse({ description: 'Record not found' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async findOne(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: number,
        @Query('relations', ParseBoolPipe) relations: boolean,
        @Query('fullFieldList', new ParseBoolPipe({ optional: true })) fullFieldList: boolean,
    ) {
        const userId = getUserId(req);
        await this.service.availableFindOneOrFail(userId, id);
        return await this.service.findOne({
            where: { id },
            relations: { company: !!relations },
            ...(!!fullFieldList ? {} : defaultFieldList),
        });
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
