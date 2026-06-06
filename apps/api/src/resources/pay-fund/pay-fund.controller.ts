import { PayFund } from './entities/pay-fund.entity';
import { AccessTokenGuard } from '@/guards';
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
import { deepTransformToShortDate } from '@repo/shared';
import { Request } from 'express';
import { CreatePayFundDto } from './dto/create-pay-fund.dto';
import { FindPayFundDto } from './dto/find-pay-fund.dto';
import { UpdatePayFundDto } from './dto/update-pay-fund.dto';
import { PayFundService } from './pay-fund.service';

@Controller('fund')
@ApiBearerAuth()
export class PayFundController {
    constructor(private readonly service: PayFundService) {}

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
        return await this.service.create(userId, deepTransformToShortDate(payload));
    }

    @Get(':id')
    @UseGuards(AccessTokenGuard)
    @ApiOkResponse({
        description: 'The found records',
        schema: { type: 'array', items: { $ref: getSchemaPath(PayFund) } },
    })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async findOne(
        @Param('id', ParseIntPipe) id: string,
        @Query('relations', ParseBoolPipe) relations: boolean,
    ): Promise<PayFund> {
        return await this.service.findOne(id, relations);
    }

    @Patch(':id')
    @UseGuards(AccessTokenGuard)
    @ApiOkResponse({ description: 'The found record', type: PayFund })
    @ApiNotFoundResponse({ description: 'Record not found' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async update(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: string,
        @Body() payload: UpdatePayFundDto,
    ): Promise<PayFund> {
        const userId = getUserId(req);
        return await this.service.update(userId, id, deepTransformToShortDate(payload));
    }

    @Delete(':id')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Update a Pay Fund record' })
    @ApiOkResponse({ description: 'The updated record', type: PayFund })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Not found' })
    async remove(@Req() req: Request, @Param('id', ParseIntPipe) id: string): Promise<PayFund> {
        const userId = getUserId(req);
        return await this.service.remove(userId, id);
    }

    @Post('list')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        description: 'The found records',
        schema: { type: 'array', items: { $ref: getSchemaPath(PayFund) } },
    })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiBadRequestResponse({ description: 'Bad request' })
    async findAll(@Body() params: FindPayFundDto): Promise<PayFund[]> {
        return await this.service.findAll(deepTransformToShortDate(params));
    }
}
