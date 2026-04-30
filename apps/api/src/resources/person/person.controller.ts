import { AccessTokenGuard } from '@/guards';
import { getUserId } from '@/utils';
import {
    Body,
    Controller,
    Delete,
    Get,
    Inject,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    Req,
    UseGuards,
    forwardRef,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiExtraModels,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import { deepTransformToShortDate } from '@repo/shared';
import { Request } from 'express';
import { IdDto, PageDto, SortingDto } from '../common/dto';
import { CreatePersonDto } from './dto/create-person.dto';
import { ListPersonsQueryDto } from './dto/list-persons-query.dto';
import { ListPersonsDto } from './dto/list-persons.dto';
import { PersonFiltersDto } from './dto/person-filters.dto';
import { PersonReadDto } from './dto/person-read.dto';
import { PersonSearchDto } from './dto/person-search.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { PersonService } from './person.service';

@ApiBearerAuth()
@ApiTags('Persons')
@ApiExtraModels(ListPersonsQueryDto, SortingDto, PageDto, PersonSearchDto, PersonFiltersDto)
@Controller('persons')
export class PersonController {
    constructor(@Inject(forwardRef(() => PersonService)) private readonly service: PersonService) {}

    @Post()
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Create person' })
    @ApiCreatedResponse({
        description: 'The record has been successfully created',
        type: IdDto,
    })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async create(@Req() req: Request, @Body() dto: CreatePersonDto): Promise<IdDto> {
        const userId = getUserId(req);
        const id = await this.service.create(userId, deepTransformToShortDate(dto));
        return { id };
    }

    @Patch(':id')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Update a Person record' })
    @ApiOkResponse({ description: 'The updated record' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Not found' })
    async update(
        @Req() req: Request,
        @Param('id') id: string,
        @Query('version', ParseIntPipe) version: number,
        @Body() dto: UpdatePersonDto,
    ) {
        const userId = getUserId(req);
        await this.service.update(userId, id, version, deepTransformToShortDate(dto));
    }

    @Delete(':id')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Soft delete a Person record' })
    @ApiOkResponse({ description: 'The record has been successfully deleted' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Not found' })
    async remove(@Req() req: Request, @Param('id') id: string, @Query('version', ParseIntPipe) version: number) {
        const userId = getUserId(req);
        await this.service.remove(userId, id, version);
    }

    @Post(':id/restore/:version')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Restore a Person record' })
    @ApiOkResponse({ description: 'The restored record' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Not found' })
    async restore(@Req() req: Request, @Param('id') id: string, @Query('version', ParseIntPipe) version: number) {
        const userId = getUserId(req);
        await this.service.restore(userId, id, version);
    }

    @Get(':id')
    @UseGuards(AccessTokenGuard)
    @ApiOkResponse({ description: 'The found record', type: PersonReadDto })
    @ApiNotFoundResponse({ description: 'Record not found' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async findOne(@Req() req: Request, @Param('id') id: string): Promise<PersonReadDto> {
        const userId = getUserId(req);
        return await this.service.findOne(userId, id);
    }

    @Get()
    @UseGuards(AccessTokenGuard)
    @ApiOkResponse({ description: 'The found records', type: ListPersonsDto })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async findAll(@Req() req: Request, @Query() query: ListPersonsQueryDto): Promise<ListPersonsDto> {
        const userId = getUserId(req);
        return this.service.findAll(userId, query);
    }
}
