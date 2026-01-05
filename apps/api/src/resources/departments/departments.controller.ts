import { AccessTokenGuard } from '@/guards';
import { getUserId } from '@/utils';
import {
    Body,
    Controller,
    Delete,
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
    getSchemaPath,
} from '@nestjs/swagger';
import { deepTransformToShortDate } from '@repo/shared';
import { Request } from 'express';
import { DepartmentsService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { FindAllDepartmentDto } from './dto/find-all-department.dto';
import { FindOneDepartmentDto } from './dto/find-one-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { DepartmentEntity } from './entities/department.entity';

@Controller('departments')
@ApiBearerAuth()
export class DepartmentsController {
    constructor(private readonly service: DepartmentsService) {}

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

    @Post('restore/:id/:version')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Soft delete a department' })
    @ApiOkResponse({ description: 'The record has been successfully deleted', type: DepartmentEntity })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Not found' })
    async restore(@Req() req: Request, @Param('id') id: string, @Param('version', ParseIntPipe) version: number) {
        const userId = getUserId(req);
        await this.service.restore(userId, id, version);
    }

    @Post('find')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        description: 'The found records',
        schema: { type: 'array', items: { $ref: getSchemaPath(DepartmentEntity) } },
    })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async findAll(@Req() req: Request, @Body() params: FindAllDepartmentDto): Promise<DepartmentEntity[]> {
        const userId = getUserId(req);
        await this.service.availableFindAllOrFail(userId, params.companyId);
        return await this.service.findAll(params);
    }

    @Post('find/:id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ description: 'The found record', type: DepartmentEntity })
    @ApiNotFoundResponse({ description: 'Record not found' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async findOne(
        @Req()
        req: Request,
        @Param('id', ParseIntPipe)
        id: string,
        @Body() params: FindOneDepartmentDto,
    ) {
        const userId = getUserId(req);
        const found = await this.service.findOne(id, params);
        await this.service.availableFindOneOrFail(userId, found.companyId);
        return found;
    }
}
