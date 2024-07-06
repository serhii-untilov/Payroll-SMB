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
import { IPosition, IPositionBalanceExtended, deepStringToShortDate } from '@repo/shared';
import { Request } from 'express';
import { AccessTokenGuard } from '../../guards/accessToken.guard';
import { CreatePositionDto } from './dto/create-position.dto';
import { FindPositionDto } from './dto/find-position.dto';
import { FindAllPositionBalanceDto } from './dto/position-balance.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { PositionsService } from './positions.service';
import { getUserId } from 'src/utils/getUserId';

@Controller('positions')
export class PositionsController {
    constructor(private readonly service: PositionsService) {}

    @Post()
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async create(@Req() req: Request, @Body() payload: CreatePositionDto): Promise<IPosition> {
        const userId = getUserId(req);
        await this.service.availableCreateOrFail(userId, payload.companyId);
        return await this.service.create(userId, deepStringToShortDate(payload));
    }

    @Post('find')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findAll(@Req() req: Request, @Body() payload: FindPositionDto): Promise<IPosition[]> {
        const userId = getUserId(req);
        await this.service.availableFindAllOrFail(userId, payload.companyId);
        return await this.service.findAll(deepStringToShortDate(payload));
    }

    @Get(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findOne(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: number,
        @Query('relations', new ParseBoolPipe({ optional: true })) relations: boolean,
        @Query('onDate') onDate: Date,
    ): Promise<IPosition> {
        const userId = getUserId(req);
        const found = await this.service.findOne(id, !!relations, onDate ? new Date(onDate) : null);
        await this.service.availableFindAllOrFail(userId, found.companyId);
        return found;
    }

    @Patch(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async update(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: UpdatePositionDto,
    ): Promise<IPosition> {
        const userId = getUserId(req);
        await this.service.availableUpdateOrFail(userId, id);
        return await this.service.update(userId, id, deepStringToShortDate(payload));
    }

    @Delete(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async remove(@Req() req: Request, @Param('id', ParseIntPipe) id: number): Promise<IPosition> {
        const userId = getUserId(req);
        await this.service.availableDeleteOrFail(userId, id);
        return await this.service.remove(userId, id);
    }

    @Post('balance')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findBalance(
        @Req() req: Request,
        @Body() payload: FindAllPositionBalanceDto,
    ): Promise<IPositionBalanceExtended[]> {
        const userId = getUserId(req);
        await this.service.availableFindAllOrFail(userId, payload.companyId);
        const response = await this.service.findAllBalance(deepStringToShortDate(payload));
        return response;
    }

    @Post('person/:id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findFirstByPersonId(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: number,
        @Query('relations', new ParseBoolPipe({ optional: true })) relations: boolean,
        @Query('onDate') onDate: Date,
        @Body() payload: { companyId: number },
    ): Promise<IPosition> {
        const userId = getUserId(req);
        const found = await this.service.findFirstByPersonId(
            payload.companyId,
            id,
            !!relations,
            onDate ? new Date(onDate) : null,
            null,
        );
        await this.service.availableFindAllOrFail(userId, found.companyId);
        return found;
    }
}
