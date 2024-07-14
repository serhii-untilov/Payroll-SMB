import { AccessTokenGuard } from '@/guards/accessToken.guard';
import { getUserId } from '@/utils/getUserId';
import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseBoolPipe,
    ParseIntPipe,
    Patch,
    Post,
    Query,
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
import { deepStringToShortDate } from '@repo/shared';
import { Request } from 'express';
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { Department } from './entities/department.entity';

@Controller('departments')
@ApiBearerAuth()
export class DepartmentsController {
    constructor(private readonly service: DepartmentsService) {}

    @Post()
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Create department' })
    @ApiCreatedResponse({
        description: 'The record has been successfully created',
        type: Department,
    })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async create(@Req() req: Request, @Body() payload: CreateDepartmentDto) {
        const userId = getUserId(req);
        await this.service.availableCreateOrFail(userId, payload.companyId);
        return await this.service.create(userId, deepStringToShortDate(payload));
    }

    @Get()
    @UseGuards(AccessTokenGuard)
    @ApiOkResponse({
        description: 'The found records',
        schema: { type: 'array', items: { $ref: getSchemaPath(Department) } },
    })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async findAll(
        @Req() req: Request,
        @Query('companyId', ParseIntPipe) companyId: number,
        @Query('relations', ParseBoolPipe) relations: boolean,
    ): Promise<Department[]> {
        const userId = getUserId(req);
        await this.service.availableFindAllOrFail(userId, companyId);
        return await this.service.findAll(companyId, !!relations);
    }

    @Get(':id')
    @UseGuards(AccessTokenGuard)
    @ApiOkResponse({ description: 'The found record', type: Department })
    @ApiNotFoundResponse({ description: 'Record not found' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async findOne(
        @Req()
        req: Request,
        @Param('id', ParseIntPipe)
        id: number,
        @Query('relations', new ParseBoolPipe({ optional: true }))
        relations?: boolean,
    ) {
        const userId = getUserId(req);
        const found = await this.service.findOne(id, !!relations);
        await this.service.availableFindOneOrFail(userId, found.companyId);
        return found;
    }

    @Patch(':id')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Update a department' })
    @ApiOkResponse({ description: 'The updated record', type: Department })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Not found' })
    async update(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: UpdateDepartmentDto,
    ) {
        const userId = getUserId(req);
        await this.service.availableUpdateOrFail(userId, id);
        return await this.service.update(userId, id, deepStringToShortDate(payload));
    }

    @Delete(':id')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Soft delete a department' })
    @ApiOkResponse({ description: 'The record has been successfully deleted', type: Department })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Not found' })
    async remove(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
        const userId = getUserId(req);
        await this.service.availableDeleteOrFail(userId, id);
        return await this.service.remove(userId, id);
    }
}
