import { AccessTokenGuard } from '@/guards';
import { PayFund } from '@/resources/pay-funds/entities/pay-fund.entity';
import { getUserId } from '@/utils';
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
import { deepStringToShortDate } from '@/types';
import { Request } from 'express';
import { CreatePayFundDto } from './dto/create-pay-fund.dto';
import { FindPayFundDto } from './dto/find-pay-fund.dto';
import { UpdatePayFundDto } from './dto/update-pay-fund.dto';
import { PayFundsService } from './pay-funds.service';

@Controller('fund')
@ApiBearerAuth()
export class PayFundsController {
    constructor(private readonly service: PayFundsService) {}

    @Post()
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Create a Pay Fund record' })
    @ApiCreatedResponse({
        description: 'The record has been successfully created',
        type: PayFund,
    })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async create(@Req() req: Request, @Body() payload: CreatePayFundDto): Promise<PayFund> {
        const userId = getUserId(req);
        const companyId = await this.service.getPositionCompanyId(payload.positionId);
        await this.service.availableCreateOrFail(userId, companyId);
        return await this.service.create(userId, deepStringToShortDate(payload));
    }

    @Get(':id')
    @UseGuards(AccessTokenGuard)
    @ApiOkResponse({
        description: 'The found records',
        schema: { type: 'array', items: { $ref: getSchemaPath(PayFund) } },
    })
    @ApiForbiddenResponse({ description: 'Forbidden' })
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
    @ApiOkResponse({ description: 'The found record', type: PayFund })
    @ApiNotFoundResponse({ description: 'Record not found' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
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
    @ApiOperation({ summary: 'Update a Pay Fund record' })
    @ApiOkResponse({ description: 'The updated record', type: PayFund })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Not found' })
    async remove(@Req() req: Request, @Param('id', ParseIntPipe) id: number): Promise<PayFund> {
        const userId = getUserId(req);
        await this.service.availableDeleteOrFail(userId, id);
        return await this.service.remove(userId, id);
    }

    @Post('find')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        description: 'The found records',
        schema: { type: 'array', items: { $ref: getSchemaPath(PayFund) } },
    })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiBadRequestResponse({ description: 'Bad request' })
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
