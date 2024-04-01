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
import { PositionHistoryService } from './position-history.service';
import { CreatePositionHistoryDto } from './dto/create-position-history.dto';
import { UpdatePositionHistoryDto } from './dto/update-position-history.dto';
import { IPositionHistory } from '@repo/shared';
import { AccessTokenGuard } from '../../guards/accessToken.guard';

@Controller('positionHistory')
export class PositionHistoryController {
    constructor(private readonly positionHistoryService: PositionHistoryService) {}

    @Post()
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async create(
        @Body() createPositionHistoryDto: CreatePositionHistoryDto,
    ): Promise<IPositionHistory> {
        return await this.positionHistoryService.create(createPositionHistoryDto);
    }

    @Get()
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findAll(): Promise<IPositionHistory[]> {
        return await this.positionHistoryService.findAll();
    }

    @Get(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<IPositionHistory> {
        return await this.positionHistoryService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updatePositionHistoryDto: UpdatePositionHistoryDto,
    ): Promise<IPositionHistory> {
        return await this.positionHistoryService.update(id, updatePositionHistoryDto);
    }

    @Delete(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async remove(@Param('id', ParseIntPipe) id: number): Promise<IPositionHistory> {
        return await this.positionHistoryService.remove(id);
    }
}
