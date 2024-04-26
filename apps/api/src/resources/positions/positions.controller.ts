import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    ParseIntPipe,
    HttpCode,
    HttpStatus,
    Query,
    ParseBoolPipe,
    Req,
} from '@nestjs/common';
import { PositionsService } from './positions.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { IPosition } from '@repo/shared';
import { AccessTokenGuard } from '../../guards/accessToken.guard';
import { Request } from 'express';

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

    @Get()
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findAll(
        @Query('companyId', ParseIntPipe) companyId: number,
        @Query('relations', ParseBoolPipe) relations: boolean,
    ): Promise<IPosition[]> {
        return await this.positionsService.findAll({
            companyId,
            relations: {
                company: relations,
                person: relations,
                history: relations,
            },
        });
    }

    @Get(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<IPosition> {
        return await this.positionsService.findOne({
            where: { id },
            relations: {
                company: true,
                person: true,
                history: true,
            },
        });
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
}
