import { AccessTokenGuard } from '@/guards/accessToken.guard';
import { getUserId } from '@/utils/getUserId';
import {
    Body,
    Controller,
    Delete,
    Get,
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
import { IRole } from '@repo/shared';
import { Request } from 'express';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { RolesService } from './roles.service';

@Controller('roles')
@ApiBearerAuth()
export class RolesController {
    constructor(private readonly service: RolesService) {}

    @Post()
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Create role' })
    @ApiCreatedResponse({
        description: 'The record has been successfully created',
        type: Role,
    })
    async create(@Req() req: Request, @Body() payload: CreateRoleDto): Promise<IRole> {
        const userId = getUserId(req);
        return await this.service.create(userId, payload);
    }

    @Get()
    @ApiOkResponse({
        description: 'The found records',
        schema: { type: 'array', items: { $ref: getSchemaPath(Role) } },
    })
    async findAll(@Req() req: Request): Promise<IRole[]> {
        const userId = getUserId(req);
        return await this.service.findAll(userId);
    }

    @Get(':id')
    @ApiOkResponse({ description: 'The found record', type: Role })
    @ApiNotFoundResponse({ description: 'Record not found' })
    async findOne(@Req() req: Request, @Param('id', ParseIntPipe) id: number): Promise<IRole> {
        const userId = getUserId(req);
        return await this.service.findOne(userId, id);
    }

    @Patch(':id')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Update a company' })
    @ApiOkResponse({ description: 'The updated record', type: Role })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Not found' })
    async update(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: UpdateRoleDto,
    ): Promise<IRole> {
        const userId = getUserId(req);
        return await this.service.update(userId, id, payload);
    }

    @Delete(':id')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Soft delete a role' })
    @ApiOkResponse({ description: 'The record has been successfully deleted', type: Role })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Not found' })
    async remove(@Req() req: Request, @Param('id', ParseIntPipe) id: number): Promise<IRole> {
        const userId = getUserId(req);
        return await this.service.remove(userId, id);
    }
}
