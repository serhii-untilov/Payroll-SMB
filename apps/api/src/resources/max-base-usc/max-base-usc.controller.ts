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
import { Request } from 'express';
import { AccessTokenGuard } from '../../guards/accessToken.guard';
import { CreateMaxBaseUscDto } from './dto/create-max-base-usc.dto';
import { UpdateMaxBaseUscDto } from './dto/update-max-base-usc.dto';
import { MaxBaseUscService } from './max-base-usc.service';
import { MaxBaseUSC } from './entities/max-base-usc.entity';

@Controller('max-base-usc')
export class MaxBaseUscController {
    constructor(private readonly service: MaxBaseUscService) {}

    @Post()
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async create(
        @Req() req: Request,
        @Body() createMaxBaseUscDto: CreateMaxBaseUscDto,
    ): Promise<MaxBaseUSC> {
        const userId = req.user['sub'];
        await this.service.availableCreateOrFail(userId);
        return await this.service.create(userId, createMaxBaseUscDto);
    }

    @Get()
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findAll(@Req() req: Request): Promise<MaxBaseUSC[]> {
        const userId = req.user['sub'];
        await this.service.availableFindAllOrFail(userId);
        return await this.service.findAll();
    }

    @Get(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findOne(@Req() req: Request, @Param('id', ParseIntPipe) id: number): Promise<MaxBaseUSC> {
        const userId = req.user['sub'];
        await this.service.availableFindOneOrFail(userId);
        return await this.service.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async update(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: UpdateMaxBaseUscDto,
    ): Promise<MaxBaseUSC> {
        const userId = req.user['sub'];
        await this.service.availableUpdateOrFail(userId);
        return await this.service.update(userId, id, payload);
    }

    @Delete(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async remove(@Req() req: Request, @Param('id', ParseIntPipe) id: number): Promise<MaxBaseUSC> {
        const userId = req.user['sub'];
        await this.service.availableDeleteOrFail(userId);
        return await this.service.remove(userId, id);
    }
}
