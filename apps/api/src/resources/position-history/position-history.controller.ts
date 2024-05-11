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
import { IPositionHistory, objectStringDateToShort } from '@repo/shared';
import { Request } from 'express';
import { AccessTokenGuard } from '../../guards/accessToken.guard';
import { CreatePositionHistoryDto } from './dto/create-position-history.dto';
import { UpdatePositionHistoryDto } from './dto/update-position-history.dto';
import { PositionHistoryService } from './position-history.service';
import { FindPositionHistoryDto } from './dto/find-position-history.dto';

@Controller('position-history')
export class PositionHistoryController {
    constructor(private readonly positionHistoryService: PositionHistoryService) {}

    @Post()
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async create(
        @Req() req: Request,
        @Body() payload: CreatePositionHistoryDto,
    ): Promise<IPositionHistory> {
        const userId = req.user['sub'];
        return await this.positionHistoryService.create(userId, objectStringDateToShort(payload));
    }

    @Get()
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findAll(
        @Req() req: Request,
        @Query('positionId', ParseIntPipe) positionId: number,
        @Query('relations', new ParseBoolPipe({ optional: true })) relations: boolean,
    ): Promise<IPositionHistory[]> {
        const userId = req.user['sub'];
        return await this.positionHistoryService.findAll(userId, positionId, !!relations);
    }

    @Get(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findOne(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: number,
        @Query('relations', new ParseBoolPipe({ optional: true })) relations: boolean,
    ): Promise<IPositionHistory> {
        const userId = req.user['sub'];
        return await this.positionHistoryService.findOne(userId, id, !!relations);
    }

    @Patch(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async update(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: UpdatePositionHistoryDto,
    ): Promise<IPositionHistory> {
        const userId = req.user['sub'];
        return await this.positionHistoryService.update(
            userId,
            id,
            objectStringDateToShort(payload),
        );
    }

    @Delete(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async remove(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<IPositionHistory> {
        const userId = req.user['sub'];
        return await this.positionHistoryService.remove(userId, id);
    }

    @Post('find-last')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findLast(
        @Req() req: Request,
        @Body() params: FindPositionHistoryDto,
    ): Promise<IPositionHistory | null> {
        const userId = req.user['sub'];
        const positionList = await this.positionHistoryService.find(
            userId,
            objectStringDateToShort(params),
        );
        // Will return the last positionHistory record or null
        positionList.sort((a, b) =>
            a.dateFrom < b.dateFrom ? -1 : a.dateFrom > b.dateFrom ? 1 : 0,
        );
        return positionList.length ? positionList[positionList.length - 1] : null;
    }
}
