import { AccessTokenGuard } from '@/guards';
import { getUserId } from '@/utils';
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
import {
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
} from '@nestjs/swagger';
import { deepTransformToShortDate } from '@repo/shared';
import { Request } from 'express';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { DepartmentReadDto } from './dto/department-read.dto';
import { ListDepartmentsQueryDto } from './dto/list-departments-query.dto';
import { ListDepartmentsDto } from './dto/list-departments.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { DepartmentEntity } from './entities/department.entity';

@Controller('departments')
@ApiBearerAuth()
export class DepartmentController {
    constructor(private readonly service: DepartmentService) {}

    @Post()
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Create department' })
    @ApiCreatedResponse({
        description: 'The record has been successfully created',
        type: DepartmentEntity,
    })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async create(@Req() req: Request, @Body() dto: CreateDepartmentDto): Promise<string> {
        const userId = getUserId(req);
        return await this.service.create(userId, deepTransformToShortDate(dto));
    }

    @Patch(':id/:version')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Update a department' })
    @ApiOkResponse({ description: 'The updated record', type: DepartmentEntity })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Not found' })
    async update(
        @Req() req: Request,
        @Param('id') id: string,
        @Param('version', ParseIntPipe) version: number,
        @Body() dto: UpdateDepartmentDto,
    ) {
        const userId = getUserId(req);
        await this.service.update(userId, id, version, deepTransformToShortDate(dto));
    }

    @Delete(':id/:version')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Soft delete a department' })
    @ApiOkResponse({ description: 'The record has been successfully deleted', type: DepartmentEntity })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Not found' })
    async remove(@Req() req: Request, @Param('id') id: string, @Param('version', ParseIntPipe) version: number) {
        const userId = getUserId(req);
        await this.service.remove(userId, id, version);
    }

    @Post(':id/restore/:version')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Soft delete a department' })
    @ApiOkResponse({ description: 'The record has been successfully deleted', type: DepartmentEntity })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Not found' })
    async restore(@Req() req: Request, @Param('id') id: string, @Param('version', ParseIntPipe) version: number) {
        const userId = getUserId(req);
        await this.service.restore(userId, id, version);
    }

    @Post('list')
    @UseGuards(AccessTokenGuard)
    @ApiOkResponse({
        description: 'The found records',
        type: ListDepartmentsDto,
    })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async findAll(@Req() req: Request, @Body() query: ListDepartmentsQueryDto): Promise<ListDepartmentsDto> {
        const userId = getUserId(req);
        return this.service.findAll(userId, query);
    }

    @Get(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ description: 'The found record', type: DepartmentEntity })
    @ApiNotFoundResponse({ description: 'Record not found' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async findOne(@Req() req: Request, @Param('id') id: string): Promise<DepartmentReadDto> {
        const userId = getUserId(req);
        return await this.service.findOne(userId, id);
    }
}
