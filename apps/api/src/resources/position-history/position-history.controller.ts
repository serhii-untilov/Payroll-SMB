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
import { IPositionHistory, deepStringToShortDate } from '@repo/shared';
import { Request } from 'express';
import { AccessTokenGuard } from '../../guards/accessToken.guard';
import { CreatePositionHistoryDto } from './dto/create-position-history.dto';
import { FindPositionHistoryDto } from './dto/find-position-history.dto';
import { UpdatePositionHistoryDto } from './dto/update-position-history.dto';
import { PositionHistoryService } from './position-history.service';
import { getUserId } from 'src/utils/getUserId';

@Controller('position-history')
export class PositionHistoryController {
    constructor(private readonly service: PositionHistoryService) {}

    @Post()
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async create(
        @Req() req: Request,
        @Body() payload: CreatePositionHistoryDto,
    ): Promise<IPositionHistory> {
        const userId = getUserId(req);
        const companyId = await this.service.getPositionCompanyId(payload.positionId);
        await this.service.availableCreateOrFail(userId, companyId);
        return await this.service.create(userId, deepStringToShortDate(payload));
    }

    @Get()
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findAll(
        @Req() req: Request,
        @Query('positionId', ParseIntPipe) positionId: number,
        @Query('relations', new ParseBoolPipe({ optional: true })) relations: boolean,
    ): Promise<IPositionHistory[]> {
        const userId = getUserId(req);
        const companyId = await this.service.getPositionCompanyId(positionId);
        await this.service.availableCreateOrFail(userId, companyId);
        return await this.service.findAll(positionId, !!relations);
    }

    @Get(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findOne(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: number,
        @Query('relations', new ParseBoolPipe({ optional: true })) relations: boolean,
    ): Promise<IPositionHistory> {
        const userId = getUserId(req);
        const found = await this.service.findOne(id, !!relations);
        const companyId = await this.service.getPositionCompanyId(found.positionId);
        await this.service.availableFindOneOrFail(userId, companyId);
        return found;
    }

    @Patch(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async update(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: UpdatePositionHistoryDto,
    ): Promise<IPositionHistory> {
        const userId = getUserId(req);
        await this.service.availableUpdateOrFail(userId, id);
        return await this.service.update(userId, id, deepStringToShortDate(payload));
    }

    @Delete(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async remove(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<IPositionHistory> {
        const userId = getUserId(req);
        await this.service.availableDeleteOrFail(userId, id);
        return await this.service.remove(userId, id);
    }

    @Post('find-last')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findLast(
        @Req() req: Request,
        @Body() params: FindPositionHistoryDto,
    ): Promise<IPositionHistory | null> {
        const userId = getUserId(req);
        const companyId = await this.service.getPositionCompanyId(params.positionId);
        await this.service.availableFindAllOrFail(userId, companyId);
        const positionList = await this.service.find(deepStringToShortDate(params));
        // Will return the last positionHistory record or null
        positionList.sort((a, b) =>
            a.dateFrom < b.dateFrom ? -1 : a.dateFrom > b.dateFrom ? 1 : 0,
        );
        return positionList.length ? positionList[positionList.length - 1] : null;
    }
}
