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
import { IPositionHistory } from '@repo/shared';
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
        @Body() createPositionHistoryDto: CreatePositionHistoryDto,
    ): Promise<IPositionHistory> {
        const userId = req.user['sub'];
        return await this.positionHistoryService.create(userId, createPositionHistoryDto);
    }

    @Get()
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findAll(
        @Req() req: Request,
        @Query('positionId', ParseIntPipe) positionId: number,
        @Query('relations', ParseBoolPipe) relations: boolean = false,
    ): Promise<IPositionHistory[]> {
        const userId = req.user['sub'];
        return await this.positionHistoryService.findAll(userId, positionId, relations);
    }

    @Get(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findOne(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: number,
        @Query('relations', ParseBoolPipe) relations: boolean = false,
    ): Promise<IPositionHistory> {
        const userId = req.user['sub'];
        return await this.positionHistoryService.findOne(userId, id, relations);
    }

    @Patch(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async update(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: number,
        @Body() updatePositionHistoryDto: UpdatePositionHistoryDto,
    ): Promise<IPositionHistory> {
        const userId = req.user['sub'];
        return await this.positionHistoryService.update(userId, id, updatePositionHistoryDto);
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

    @Post('find')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async find(
        @Req() req: Request,
        @Body() params: FindPositionHistoryDto,
    ): Promise<IPositionHistory | null> {
        const userId = req.user['sub'];
        return await this.positionHistoryService.find(userId, params);
    }
}
