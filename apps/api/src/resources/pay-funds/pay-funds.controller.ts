import {
    BadRequestException,
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
import { CreatePayFundDto } from './dto/create-pay-fund.dto';
import { UpdatePayFundDto } from './dto/update-pay-fund.dto';
import { PayFundsService } from './pay-funds.service';
import { AccessTokenGuard } from '../../guards/accessToken.guard';
import { Request } from 'express';
import { deepStringToShortDate } from '@repo/shared';
import { PayFund } from './entities/pay-fund.entity';
import { FindPayFundDto } from './dto/find-pay-fund.dto';
import { getUserId } from './../../utils/getUserId';

@Controller('fund')
export class PayFundsController {
    constructor(private readonly service: PayFundsService) {}

    @Post()
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async create(@Req() req: Request, @Body() payload: CreatePayFundDto): Promise<PayFund> {
        const userId = getUserId(req);
        const companyId = await this.service.getPositionCompanyId(payload.positionId);
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
    ): Promise<PayFund> {
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
        @Body() payload: UpdatePayFundDto,
    ): Promise<PayFund> {
        const userId = getUserId(req);
        await this.service.availableUpdateOrFail(userId, id);
        return await this.service.update(userId, id, deepStringToShortDate(payload));
    }

    @Delete(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async remove(@Req() req: Request, @Param('id', ParseIntPipe) id: number): Promise<PayFund> {
        const userId = getUserId(req);
        await this.service.availableDeleteOrFail(userId, id);
        return await this.service.remove(userId, id);
    }

    @Post('find-all')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findAll(@Req() req: Request, @Body() params: FindPayFundDto): Promise<PayFund[]> {
        const userId = getUserId(req);
        if (params.companyId) {
            await this.service.availableFindAllOrFail(userId, params.companyId);
        } else if (params.positionId) {
            const companyId = await this.service.getPositionCompanyId(params.positionId);
            await this.service.availableFindAllOrFail(userId, companyId);
        } else {
            throw new BadRequestException('Company or Position should be defined.');
        }
        return await this.service.findAll(deepStringToShortDate(params));
    }
}
