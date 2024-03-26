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
import { PayPeriodsService } from './pay-periods.service';
import { CreatePayPeriodDto } from './dto/create-pay-period.dto';
import { UpdatePayPeriodDto } from './dto/update-pay-period.dto';
import { PayPeriodState } from '@repo/shared';

const defaultFieldList = {
    select: {
        id: true,
        companyId: true,
        dateFrom: true,
        dateTo: true,
        state: true,
    },
};

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
        @Query('companyId', ParseIntPipe) companyId: number,
        @Query('relations', ParseBoolPipe) relations: boolean,
        @Query('fullFieldList', ParseBoolPipe) fullFieldList: boolean,
    ) {
        return await this.payPeriodsService.findAll(
            fullFieldList
                ? { companyId, relations: { company: relations } }
                : { companyId, relations: { company: relations }, ...defaultFieldList },
        );
    }

    @Get(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findOne(
        @Param('id', ParseIntPipe) id: number,
        @Query('relations', ParseBoolPipe) relations: boolean,
        @Query('fullFieldList', ParseBoolPipe) fullFieldList: boolean,
    ) {
        return await this.payPeriodsService.findOne(
            fullFieldList
                ? { where: { id }, relations: { company: relations } }
                : { where: { id }, relations: { company: relations }, ...defaultFieldList },
        );
    }

    @Get('current')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findCurrent(
        @Query('companyId', ParseIntPipe) companyId: number,
        @Query('relations', ParseBoolPipe) relations: boolean,
        @Query('fullFieldList', ParseBoolPipe) fullFieldList: boolean,
    ) {
        return await this.payPeriodsService.findOne(
            fullFieldList
                ? {
                      where: { companyId, state: PayPeriodState.CURRENT },
                      relations: { company: relations },
                  }
                : {
                      where: { companyId, state: PayPeriodState.CURRENT },
                      relations: { company: relations },
                      ...defaultFieldList,
                  },
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
}
