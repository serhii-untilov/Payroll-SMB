import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LawsService } from './laws.service';
import { CreateLawDto } from './dto/create-law.dto';
import { UpdateLawDto } from './dto/update-law.dto';
import { ILaw } from '@repo/shared';

@Controller('laws')
export class LawsController {
    constructor(private readonly lawsService: LawsService) {}

    @Post()
    async create(@Body() createLawDto: CreateLawDto): Promise<ILaw> {
        return await this.lawsService.create(createLawDto);
    }

    @Get()
    async findAll(): Promise<ILaw[]> {
        return await this.lawsService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<ILaw> {
        return await this.lawsService.findOne(+id);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateLawDto: UpdateLawDto): Promise<ILaw> {
        return await this.lawsService.update(+id, updateLawDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<ILaw> {
        return await this.lawsService.remove(+id);
    }
}
