import { AccessTokenGuard } from '@/guards';
import { getUserId } from '@/utils';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
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
import { CreatePersonCommand } from './commands/create-person.command';
import { CreatePersonDto } from './commands/dto/create-person.dto';
import { UpdatePersonDto } from './commands/dto/update-person.dto';
import { RemovePersonCommand } from './commands/remove-person.command';
import { RestorePersonCommand } from './commands/restore-person.command';
import { UpdatePersonCommand } from './commands/update-person.command';
import { PersonFiltersDto } from './queries/dto/person-filters.dto';
import { ListPersonsDto } from './queries/dto/list-persons.dto';
import { PersonReadDto } from './queries/dto/person-read.dto';
import { PersonSearchDto } from './queries/dto/person-search.dto';
import { FindPersonByIdQuery } from './queries/find-person-by-id.query';
import { ListPersonsQuery } from './queries/list-persons.query';

@ApiBearerAuth()
@ApiTags('Persons')
@ApiExtraModels(ListPersonsQuery, SortingDto, PageDto, PersonSearchDto, PersonFiltersDto)
@Controller('persons')
export class PersonController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) {}

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
        // TODO: check user role permissions
        const id = await this.commandBus.execute(new CreatePersonCommand(userId, deepTransformToShortDate(dto)));
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
        // TODO: check user role permissions
        await this.commandBus.execute(new UpdatePersonCommand(userId, id, version, deepTransformToShortDate(dto)));
    }

    @Delete(':id')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Soft delete a Person record' })
    @ApiOkResponse({ description: 'The record has been successfully deleted' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Not found' })
    async remove(@Req() req: Request, @Param('id') id: string, @Query('version', ParseIntPipe) version: number) {
        const userId = getUserId(req);
        // TODO: check user role permissions
        await this.commandBus.execute(new RemovePersonCommand(userId, id, version));
    }

    @Post(':id/restore')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Restore a Person record' })
    @ApiOkResponse({ description: 'The restored record' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Not found' })
    async restore(@Req() req: Request, @Param('id') id: string, @Query('version', ParseIntPipe) version: number) {
        const userId = getUserId(req);
        // TODO: check user role permissions
        await this.commandBus.execute(new RestorePersonCommand(userId, id, version));
    }

    @Get(':id')
    @UseGuards(AccessTokenGuard)
    @ApiOkResponse({ description: 'The found record', type: PersonReadDto })
    @ApiNotFoundResponse({ description: 'Record not found' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async findOne(@Req() req: Request, @Param('id') id: string): Promise<PersonReadDto> {
        const _userId = getUserId(req);
        // TODO: check user role permissions
        return await this.queryBus.execute(new FindPersonByIdQuery(id));
    }

    @Get()
    @UseGuards(AccessTokenGuard)
    @ApiOkResponse({ description: 'The found records', type: ListPersonsDto })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    // Offset pagination
    async findAll(@Req() req: Request, @Query() query: ListPersonsQuery): Promise<ListPersonsDto> {
        const _userId = getUserId(req);
        // TODO: check user role permissions
        return this.queryBus.execute(query);
    }
}
