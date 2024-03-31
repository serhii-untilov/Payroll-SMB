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
import { Request } from 'express';
import { AccessTokenGuard } from '../../guards/accessToken.guard';
import { CreatePayPeriodDto } from './dto/create-pay-period.dto';
import { UpdatePayPeriodDto } from './dto/update-pay-period.dto';
import { defaultFieldList } from './entities/pay-period.entity';
import { PayPeriodsService } from './pay-periods.service';
import { PaymentSchedule } from '@repo/shared';

@Controller('pay-periods')
export class PayPeriodsController {
    constructor(private readonly payPeriodsService: PayPeriodsService) {}

    @Post()
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async create(@Req() req: Request, @Body() createPayPeriodDto: CreatePayPeriodDto) {
        const userId = req.user['sub'];
        return await this.payPeriodsService.create(userId, createPayPeriodDto);
    }

    @Get()
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findAll(
        @Req() req: Request,
        @Query('companyId', ParseIntPipe) companyId: number,
        @Query('relations', ParseBoolPipe) relations: boolean,
        @Query('fullFieldList', ParseBoolPipe) fullFieldList: boolean,
    ) {
        const userId = req.user['sub'];
        return await this.payPeriodsService.findAll(userId, companyId, {
            where: { companyId },
            relations: { company: relations },
            ...(fullFieldList ? {} : defaultFieldList),
        });
    }

    @Get(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findOne(
        @Param('id', ParseIntPipe) id: number,
        @Query('relations', ParseBoolPipe) relations: boolean,
        @Query('fullFieldList', ParseBoolPipe) fullFieldList: boolean,
    ) {
        return await this.payPeriodsService.findOne({
            where: { id },
            relations: { company: relations },
            ...(fullFieldList ? {} : defaultFieldList),
        });
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
        return await this.payPeriodsService.findCurrent(
            userId,
            companyId,
            relations,
            fullFieldList,
        );
    }

    @Patch(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async update(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: number,
        @Body() updatePayPeriodDto: UpdatePayPeriodDto,
    ) {
        const userId = req.user['sub'];
        return await this.payPeriodsService.update(userId, id, updatePayPeriodDto);
    }

    @Delete(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async remove(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
        const userId = req.user['sub'];
        return await this.payPeriodsService.remove(userId, id);
    }

    @Get('generate')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async generate(@Query('paymentSchedule') paymentSchedule: PaymentSchedule) {
        return await this.payPeriodsService.generate(paymentSchedule);
    }
}
