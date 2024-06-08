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
import { PaymentSchedule, deepStringToShortDate } from '@repo/shared';
import { Request } from 'express';
import { AccessTokenGuard } from '../../guards/accessToken.guard';
import { CreatePayPeriodDto } from './dto/create-pay-period.dto';
import { UpdatePayPeriodDto } from './dto/update-pay-period.dto';
import { defaultFieldList } from './entities/pay-period.entity';
import { PayPeriodsService } from './pay-periods.service';

@Controller('pay-periods')
export class PayPeriodsController {
    constructor(private readonly service: PayPeriodsService) {}

    @Post()
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async create(@Req() req: Request, @Body() payload: CreatePayPeriodDto) {
        const userId = req.user['sub'];
        await this.service.availableCreateOrFail(userId, payload.companyId);
        return await this.service.create(userId, deepStringToShortDate(payload));
    }

    @Get()
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findAll(
        @Req() req: Request,
        @Query('companyId', new ParseIntPipe({ optional: true })) companyId: number,
        @Query('relations', new ParseBoolPipe({ optional: true })) relations: boolean,
        @Query('fullFieldList', new ParseBoolPipe({ optional: true })) fullFieldList: boolean,
    ) {
        const userId = req.user['sub'];
        companyId && (await this.service.availableFindAllOrFail(userId, companyId));
        return await this.service.findAll(companyId, relations, fullFieldList);
    }

    @Get('current')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findCurrent(
        @Req() req: Request,
        @Query('companyId', ParseIntPipe) companyId: number,
        @Query('relations', ParseBoolPipe) relations: boolean,
        @Query('fullFieldList', ParseBoolPipe) fullFieldList: boolean,
    ) {
        const userId = req.user['sub'];
        await this.service.availableFindAllOrFail(userId, companyId);
        return await this.service.findCurrent(userId, companyId, !!relations, !!fullFieldList);
    }

    @Get(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findOne(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: number,
        @Query('relations', ParseBoolPipe) relations: boolean,
        @Query('fullFieldList', new ParseBoolPipe({ optional: true })) fullFieldList: boolean,
    ) {
        const userId = req.user['sub'];
        await this.service.availableFindOneOrFail(userId, id);
        return await this.service.findOne({
            where: { id },
            relations: { company: !!relations },
            ...(!!fullFieldList ? {} : defaultFieldList),
        });
    }

    @Patch(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async update(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: UpdatePayPeriodDto,
    ) {
        const userId = req.user['sub'];
        await this.service.availableUpdateOrFail(userId, id);
        return await this.service.update(userId, id, deepStringToShortDate(payload));
    }

    @Delete(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async remove(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
        const userId = req.user['sub'];
        await this.service.availableDeleteOrFail(userId, id);
        return await this.service.remove(userId, id);
    }

    @Get('generate')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async generate(@Query('paymentSchedule') paymentSchedule: PaymentSchedule) {
        return await this.service.generate(paymentSchedule);
    }
}
