import { Position } from './entities/position.entity';
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
import { deepStringToShortDate } from '@repo/shared';
import { Request } from 'express';
import { CreatePositionDto } from './dto/create-position.dto';
import { FindAllPositionDto } from './dto/find-all-position.dto';
import { FindOnePositionDto } from './dto/find-one-position.dto';
import { FindAllPositionBalanceDto } from './dto/find-position-balance.dto';
import { FindPositionByPersonDto } from './dto/find-position-by-person.dto';
import { PositionBalanceExtendedDto } from './dto/position-balance-extended.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { PositionsService } from './positions.service';

@Controller('positions')
@ApiBearerAuth()
export class PositionsController {
    constructor(private readonly service: PositionsService) {}

    @Post()
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Create Position record' })
    @ApiCreatedResponse({
        description: 'The record has been successfully created',
        type: Position,
    })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async create(@Req() req: Request, @Body() payload: CreatePositionDto): Promise<Position> {
        const userId = getUserId(req);
        await this.service.availableCreateOrFail(userId, payload.companyId);
        return await this.service.create(userId, deepStringToShortDate(payload));
    }

    @Post('find')
    @UseGuards(AccessTokenGuard)
    @ApiOkResponse({
        description: 'The found records',
        schema: { type: 'array', items: { $ref: getSchemaPath(Position) } },
    })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async findAll(@Req() req: Request, @Body() payload: FindAllPositionDto): Promise<Position[]> {
        const userId = getUserId(req);
        await this.service.availableFindAllOrFail(userId, payload.companyId);
        return await this.service.findAll(deepStringToShortDate(payload));
    }

    @Post('find/:id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ description: 'The found record', type: Position })
    @ApiNotFoundResponse({ description: 'Record not found' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async findOne(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: string,
        @Body() params: FindOnePositionDto,
    ): Promise<Position> {
        const userId = getUserId(req);
        const found = await this.service.findOne(id, params);
        await this.service.availableFindAllOrFail(userId, found.companyId);
        return found;
    }

    @Patch(':id')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Update a Position record' })
    @ApiOkResponse({ description: 'The updated record', type: Position })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Not found' })
    async update(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: string,
        @Body() payload: UpdatePositionDto,
    ): Promise<Position> {
        const userId = getUserId(req);
        await this.service.availableUpdateOrFail(userId, id);
        return await this.service.update(userId, id, deepStringToShortDate(payload));
    }

    @Delete(':id')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Soft delete a Position record' })
    @ApiOkResponse({ description: 'The record has been successfully deleted', type: Position })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Not found' })
    async remove(@Req() req: Request, @Param('id', ParseIntPipe) id: string): Promise<Position> {
        const userId = getUserId(req);
        await this.service.availableDeleteOrFail(userId, id);
        return await this.service.remove(userId, id);
    }

    @Post('balance')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        description: 'The found records',
        type: PositionBalanceExtendedDto,
        isArray: true,
    })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async findBalance(
        @Req() req: Request,
        @Body() payload: FindAllPositionBalanceDto,
    ): Promise<PositionBalanceExtendedDto[]> {
        const userId = getUserId(req);
        await this.service.availableFindAllOrFail(userId, payload.companyId);
        return await this.service.findAllBalance(deepStringToShortDate(payload));
    }

    @Post('position-by-person')
    @UseGuards(AccessTokenGuard)
    @ApiOkResponse({ description: 'The found record', type: Position })
    @ApiNotFoundResponse({ description: 'Record not found' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async findFirstByPersonId(
        @Req() req: Request,
        @Body() payload: FindPositionByPersonDto,
    ): Promise<Position> {
        const userId = getUserId(req);
        const found = await this.service.findFirstByPersonId(payload);
        await this.service.availableFindAllOrFail(userId, found.companyId);
        return found;
    }
}
