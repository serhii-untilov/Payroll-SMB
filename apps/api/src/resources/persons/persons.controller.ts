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
import { IPerson } from '@repo/shared';
import { Request } from 'express';
import { AccessTokenGuard } from '../../guards/accessToken.guard';
import { CreatePersonDto } from './dto/create-person.dto';
import { FindPersonDto } from './dto/find-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { PersonsService } from './persons.service';

@Controller('persons')
export class PersonsController {
    constructor(private readonly service: PersonsService) {}

    @Post()
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async create(@Req() req: Request, @Body() person: CreatePersonDto): Promise<IPerson> {
        const userId = req.user['sub'];
        await this.service.availableCreateOrFail(userId);
        return await this.service.create(userId, person);
    }

    @Get()
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findAll(@Req() req: Request): Promise<IPerson[]> {
        const userId = req.user['sub'];
        await this.service.availableFindAllOrFail(userId);
        return await this.service.findAll(userId);
    }

    @Get(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findOne(@Req() req: Request, @Param('id', ParseIntPipe) id: number): Promise<IPerson> {
        const userId = req.user['sub'];
        await this.service.availableFindOneOrFail(userId);
        return await this.service.findOne(userId, id);
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
        await this.service.availableUpdateOrFail(userId);
        return await this.service.update(userId, id, person);
    }

    @Delete(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async remove(@Req() req: Request, @Param('id', ParseIntPipe) id: number): Promise<IPerson> {
        const userId = req.user['sub'];
        await this.service.availableDeleteOrFail(userId);
        return await this.service.remove(userId, id);
    }

    @Post('find')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async find(@Req() req: Request, @Body() person: FindPersonDto): Promise<IPerson | null> {
        const userId = req.user['sub'];
        await this.service.availableFindOneOrFail(userId);
        return await this.service.find(userId, person);
    }
}
