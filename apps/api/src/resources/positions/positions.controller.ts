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
import { IPosition, deepStringToShortDate } from '@repo/shared';
import { Request } from 'express';
import { AccessTokenGuard } from '../../guards/accessToken.guard';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { PositionsService } from './positions.service';
import { FindPositionDto } from './dto/find-position.dto';
import { FindAllPositionBalanceDto } from './dto/position-balance.dto copy';

@Controller('positions')
export class PositionsController {
    constructor(private readonly positionsService: PositionsService) {}

    @Post()
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async create(
        @Req() req: Request,
        @Body() createPositionDto: CreatePositionDto,
    ): Promise<IPosition> {
        const userId = req.user['sub'];
        return await this.positionsService.create(userId, createPositionDto);
    }

    @Post('find')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findAll(@Req() req: Request, @Body() payload: FindPositionDto): Promise<IPosition[]> {
        const userId = req.user['sub'];
        return await this.positionsService.findAll(userId, deepStringToShortDate(payload));
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
        const userId = req.user['sub'];
        return await this.positionsService.findOne(
            userId,
            id,
            !!relations,
            onDate ? new Date(onDate) : null,
        );
    }

    @Patch(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async update(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: number,
        @Body() updatePositionDto: UpdatePositionDto,
    ): Promise<IPosition> {
        const userId = req.user['sub'];
        return await this.positionsService.update(userId, id, updatePositionDto);
    }

    @Delete(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async remove(@Req() req: Request, @Param('id', ParseIntPipe) id: number): Promise<IPosition> {
        const userId = req.user['sub'];
        return await this.positionsService.remove(userId, id);
    }

    @Post('balance')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findBalance(
        @Req() req: Request,
        @Body() payload: FindAllPositionBalanceDto,
    ): Promise<IPosition[]> {
        const userId = req.user['sub'];
        return await this.positionsService.findAllBalance(userId, deepStringToShortDate(payload));
    }
}
