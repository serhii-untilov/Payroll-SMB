import { PositionHistory } from './entities/position-history.entity';
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
import { CreatePositionHistoryDto } from './dto/create-position-history.dto';
import { FindAllPositionHistoryDto } from './dto/find-all-position-history.dto';
import { FindOnePositionHistoryDto } from './dto/find-one-position-history.dto';
import { UpdatePositionHistoryDto } from './dto/update-position-history.dto';
import { PositionHistoryService } from './position-history.service';

@Controller('position-history')
@ApiBearerAuth()
export class PositionHistoryController {
    constructor(private readonly service: PositionHistoryService) {}

    @Post()
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Create Position History record' })
    @ApiCreatedResponse({
        description: 'The record has been successfully created',
        type: PositionHistory,
    })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async create(@Req() req: Request, @Body() payload: CreatePositionHistoryDto): Promise<PositionHistory> {
        const userId = getUserId(req);
        const companyId = await this.service.getPositionCompanyId(payload.positionId);
        await this.service.availableCreateOrFail(userId, companyId);
        return await this.service.create(userId, deepTransformToShortDate(payload));
    }

    @Post('find/')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        description: 'The found records',
        schema: { type: 'array', items: { $ref: getSchemaPath(PositionHistory) } },
    })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async findAll(@Req() req: Request, @Body() params: FindAllPositionHistoryDto): Promise<PositionHistory[]> {
        const userId = getUserId(req);
        const companyId = await this.service.getPositionCompanyId(params.positionId);
        await this.service.availableCreateOrFail(userId, companyId);
        return await this.service.findAll(deepTransformToShortDate(params));
    }

    @Post('find/last')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ description: 'The found record', type: PositionHistory })
    @ApiNotFoundResponse({ description: 'Record not found' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async findLast(@Req() req: Request, @Body() params: FindAllPositionHistoryDto): Promise<PositionHistory | null> {
        const userId = getUserId(req);
        const companyId = await this.service.getPositionCompanyId(params.positionId);
        await this.service.availableFindAllOrFail(userId, companyId);
        const response = await this.service.findAll({
            ...deepTransformToShortDate(params),
            last: true,
        });
        return response.length ? response[0] : null;
    }

    @Post('find/:id')
    @UseGuards(AccessTokenGuard)
    @ApiOkResponse({ description: 'The found record', type: PositionHistory })
    @ApiNotFoundResponse({ description: 'Record not found' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async findOne(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: string,
        @Body() params: FindOnePositionHistoryDto,
    ): Promise<PositionHistory> {
        const userId = getUserId(req);
        const found = await this.service.findOne(id, params);
        const companyId = await this.service.getPositionCompanyId(found.positionId);
        await this.service.availableFindOneOrFail(userId, companyId);
        return found;
    }

    @Patch(':id')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Update a Position History record' })
    @ApiOkResponse({ description: 'The updated record', type: PositionHistory })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Not found' })
    async update(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: string,
        @Body() payload: UpdatePositionHistoryDto,
    ): Promise<PositionHistory> {
        const userId = getUserId(req);
        await this.service.availableUpdateOrFail(userId, id);
        return await this.service.update(userId, id, deepTransformToShortDate(payload));
    }

    @Delete(':id')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Soft delete a Position History record' })
    @ApiOkResponse({
        description: 'The record has been successfully deleted',
        type: PositionHistory,
    })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Not found' })
    async remove(@Req() req: Request, @Param('id', ParseIntPipe) id: string): Promise<PositionHistory> {
        const userId = getUserId(req);
        await this.service.availableDeleteOrFail(userId, id);
        return await this.service.remove(userId, id);
    }
}
