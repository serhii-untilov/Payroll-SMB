import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { LawsService } from './laws.service';
import { CreateLawDto } from './dto/create-law.dto';
import { UpdateLawDto } from './dto/update-law.dto';

@Controller('laws')
export class LawsController {
    constructor(private readonly lawsService: LawsService) {}

    @Post()
    create(@Body() createLawDto: CreateLawDto) {
        return this.lawsService.create(createLawDto);
    }

    @Get()
    findAll() {
        return this.lawsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.lawsService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateLawDto: UpdateLawDto) {
        return this.lawsService.update(+id, updateLawDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.lawsService.remove(+id);
    }
}
