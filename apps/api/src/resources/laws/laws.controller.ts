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
import { LawsService } from './laws.service';
import { CreateLawDto } from './dto/create-law.dto';
import { UpdateLawDto } from './dto/update-law.dto';
import { ILaw } from '@repo/shared';
import { AccessTokenGuard } from '../../guards/accessToken.guard';

@Controller('laws')
export class LawsController {
    constructor(private readonly lawsService: LawsService) {}

    @Post()
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async create(@Body() createLawDto: CreateLawDto): Promise<ILaw> {
        return await this.lawsService.create(createLawDto);
    }

    @Get()
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findAll(): Promise<ILaw[]> {
        return await this.lawsService.findAll();
    }

    @Get(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<ILaw> {
        return await this.lawsService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateLawDto: UpdateLawDto,
    ): Promise<ILaw> {
        return await this.lawsService.update(id, updateLawDto);
    }

    @Delete(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async remove(@Param('id', ParseIntPipe) id: number): Promise<ILaw> {
        return await this.lawsService.remove(id);
    }
}
