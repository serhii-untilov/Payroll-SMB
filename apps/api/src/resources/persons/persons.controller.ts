import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseBoolPipe,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { IPerson } from '@repo/shared';
import { Request } from 'express';
import { AccessTokenGuard } from '../../guards/accessToken.guard';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { PersonsService } from './persons.service';

@Controller('persons')
export class PersonsController {
    constructor(private readonly personsService: PersonsService) {}

    @Post()
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async create(@Req() req: Request, @Body() person: CreatePersonDto): Promise<IPerson> {
        const userId = req.user['sub'];
        return await this.personsService.create(userId, person);
    }

    @Get()
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findAll(@Req() req: Request): Promise<IPerson[]> {
        const userId = req.user['sub'];
        return await this.personsService.findAll(userId);
    }

    @Get(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findOne(@Req() req: Request, @Param('id', ParseIntPipe) id: number): Promise<IPerson> {
        const userId = req.user['sub'];
        return await this.personsService.findOne(userId, id);
    }

    @Patch(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async update(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: number,
        @Body() person: UpdatePersonDto,
    ): Promise<IPerson> {
        const userId = req.user['sub'];
        return await this.personsService.update(userId, id, person);
    }

    @Delete(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async remove(@Req() req: Request, @Param('id', ParseIntPipe) id: number): Promise<IPerson> {
        const userId = req.user['sub'];
        return await this.personsService.remove(userId, id);
    }
}
