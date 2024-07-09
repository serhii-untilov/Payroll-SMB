import { AccessTokenGuard } from '@/guards/accessToken.guard';
import { getUserId } from '@/utils/getUserId';
import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { deepStringToShortDate } from '@repo/shared';
import { Request } from 'express';
import { CreateMinWageDto } from './dto/create-min-wage.dto';
import { UpdateMinWageDto } from './dto/update-min-wage.dto';
import { MinWage } from './entities/min-wage.entity';
import { MinWageService } from './min-wage.service';

@Controller('min-wage')
export class MinWageController {
    constructor(private readonly service: MinWageService) {}

    @Post()
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async create(@Req() req: Request, @Body() payload: CreateMinWageDto): Promise<MinWage> {
        const userId = getUserId(req);
        await this.service.availableCreateOrFail(userId);
        return await this.service.create(userId, deepStringToShortDate(payload));
    }

    @Post()
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findAll(@Req() req: Request): Promise<MinWage[]> {
        const userId = getUserId(req);
        await this.service.availableFindAllOrFail(userId);
        return this.service.findAll();
    }

    @Get(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findOne(@Req() req: Request, @Param('id', ParseIntPipe) id: number): Promise<MinWage> {
        const userId = getUserId(req);
        await this.service.availableFindOneOrFail(userId);
        return await this.service.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async update(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: UpdateMinWageDto,
    ): Promise<MinWage> {
        const userId = getUserId(req);
        await this.service.availableUpdateOrFail(userId);
        return await this.service.update(userId, id, deepStringToShortDate(payload));
    }

    @Delete(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async remove(@Req() req: Request, @Param('id', ParseIntPipe) id: number): Promise<MinWage> {
        const userId = getUserId(req);
        await this.service.availableDeleteOrFail(userId);
        return await this.service.remove(userId, id);
    }
}
