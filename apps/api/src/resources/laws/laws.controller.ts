import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
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
    async create(@Body() createLawDto: CreateLawDto): Promise<ILaw> {
        return await this.lawsService.create(createLawDto);
    }

    @Get()
    @UseGuards(AccessTokenGuard)
    async findAll(): Promise<ILaw[]> {
        return await this.lawsService.findAll();
    }

    @Get(':id')
    @UseGuards(AccessTokenGuard)
    async findOne(@Param('id') id: string): Promise<ILaw> {
        return await this.lawsService.findOne(+id);
    }

    @Patch(':id')
    @UseGuards(AccessTokenGuard)
    async update(@Param('id') id: string, @Body() updateLawDto: UpdateLawDto): Promise<ILaw> {
        return await this.lawsService.update(+id, updateLawDto);
    }

    @Delete(':id')
    @UseGuards(AccessTokenGuard)
    async remove(@Param('id') id: string): Promise<ILaw> {
        return await this.lawsService.remove(+id);
    }
}
