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
} from '@nestjs/common';
import { PositionsService } from './positions.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { IPosition } from '@repo/shared';
import { AccessTokenGuard } from '../../guards/accessToken.guard';

@Controller('positions')
export class PositionsController {
    constructor(private readonly positionsService: PositionsService) {}

    @Post()
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async create(@Body() createPositionDto: CreatePositionDto): Promise<IPosition> {
        return await this.positionsService.create(createPositionDto);
    }

    @Get()
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findAll(): Promise<IPosition[]> {
        return await this.positionsService.findAll();
    }

    @Get(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<IPosition> {
        return await this.positionsService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updatePositionDto: UpdatePositionDto,
    ): Promise<IPosition> {
        return await this.positionsService.update(id, updatePositionDto);
    }

    @Delete(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async remove(@Param('id', ParseIntPipe) id: number): Promise<IPosition> {
        return await this.positionsService.remove(id);
    }
}
