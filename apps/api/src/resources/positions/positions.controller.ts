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
import { FindPositionDto } from './dto/find-position.dto';
import { FindAllPositionBalanceDto } from './dto/position-balance.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { PositionsService } from './positions.service';

@Controller('positions')
export class PositionsController {
    constructor(private readonly positionsService: PositionsService) {}

    @Post()
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async create(@Req() req: Request, @Body() payload: CreatePositionDto): Promise<IPosition> {
        const userId = req.user['sub'];
        await this.positionsService.availableCreateOrFail(userId, payload.companyId);
        return await this.positionsService.create(userId, deepStringToShortDate(payload));
    }

    @Post('find')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findAll(@Req() req: Request, @Body() payload: FindPositionDto): Promise<IPosition[]> {
        const userId = req.user['sub'];
        await this.positionsService.availableFindAllOrFail(userId, payload.companyId);
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
        const found = await this.positionsService.findOne(
            id,
            !!relations,
            onDate ? new Date(onDate) : null,
        );
        await this.positionsService.availableFindAllOrFail(userId, found.companyId);
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
        const userId = req.user['sub'];
        await this.positionsService.availableUpdateOrFail(userId, id);
        return await this.positionsService.update(userId, id, deepStringToShortDate(payload));
    }

    @Delete(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async remove(@Req() req: Request, @Param('id', ParseIntPipe) id: number): Promise<IPosition> {
        const userId = req.user['sub'];
        await this.positionsService.availableDeleteOrFail(userId, id);
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
        await this.positionsService.availableFindAllOrFail(userId, payload.companyId);
        const response = await this.positionsService.findAllBalance(
            userId,
            deepStringToShortDate(payload),
        );
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
        const userId = req.user['sub'];
        const found = await this.positionsService.findFirstByPersonId(
            userId,
            payload.companyId,
            id,
            !!relations,
            onDate ? new Date(onDate) : null,
        );
        await this.positionsService.availableFindAllOrFail(userId, found.companyId);
        return found;
    }
}
