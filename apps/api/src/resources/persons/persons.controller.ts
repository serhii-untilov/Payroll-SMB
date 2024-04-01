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
import { PersonsService } from './persons.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { IPerson } from '@repo/shared';
import { AccessTokenGuard } from '../../guards/accessToken.guard';

@Controller('persons')
export class PersonsController {
    constructor(private readonly personsService: PersonsService) {}

    @Post()
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async create(@Body() createPersonDto: CreatePersonDto): Promise<IPerson> {
        return await this.personsService.create(createPersonDto);
    }

    @Get()
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findAll(): Promise<IPerson[]> {
        return await this.personsService.findAll();
    }

    @Get(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<IPerson> {
        return await this.personsService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updatePersonDto: UpdatePersonDto,
    ): Promise<IPerson> {
        return await this.personsService.update(id, updatePersonDto);
    }

    @Delete(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async remove(@Param('id', ParseIntPipe) id: number): Promise<IPerson> {
        return await this.personsService.remove(id);
    }
}
