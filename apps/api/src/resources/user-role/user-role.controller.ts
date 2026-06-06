import { AccessTokenGuard } from '@/guards';
import { RoleType } from '@/types';
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
    getSchemaPath,
} from '@nestjs/swagger';
import { Request } from 'express';
import { CreateUserRoleDto } from './dto/create-user-role.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UserRole } from './entities/user-role.entity';
import { UserRoleService } from './user-role.service';

@Controller('user-roles')
@ApiBearerAuth()
export class UserRoleController {
    constructor(private readonly service: UserRoleService) {}

    @Post()
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Create a user role' })
    @ApiCreatedResponse({
        description: 'The record has been successfully created',
        type: UserRole,
    })
    async create(@Req() req: Request, @Body() dto: CreateUserRoleDto): Promise<string> {
        const userId = getUserId(req);
        return await this.service.create(userId, dto);
    }

    @Get()
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'List user roles' })
    @ApiOkResponse({
        description: 'The found records',
        schema: { type: 'array', items: { $ref: getSchemaPath(UserRole) } },
    })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async findAll(@Req() req: Request): Promise<UserRole[]> {
        const userId = getUserId(req);
        return await this.service.findAll(userId);
    }

    @Get(':id')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Get a user role' })
    @ApiOkResponse({ description: 'The found record', type: UserRole })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Not found' })
    async findOne(@Req() req: Request, @Param('id') id: string): Promise<UserRole> {
        const userId = getUserId(req);
        return await this.service.findOne(userId, id);
    }

    @Patch(':id/:version')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Update a user role' })
    @ApiOkResponse({ description: 'The updated record', type: UserRole })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Not found' })
    async update(
        @Req() req: Request,
        @Param('id') id: string,
        @Param('version', ParseIntPipe) version: number,
        @Body() payload: UpdateUserRoleDto,
    ): Promise<void> {
        const userId = getUserId(req);
        await this.service.update(userId, id, version, payload);
    }

    @Delete(':id/:version')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Soft delete a user role' })
    @ApiOkResponse({ description: 'The record has been successfully deleted', type: UserRole })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Not found' })
    async remove(
        @Req() req: Request,
        @Param('id') id: string,
        @Param('version', ParseIntPipe) version: number,
    ): Promise<void> {
        const userId = getUserId(req);
        await this.service.remove(userId, id, version);
    }

    @Post(':id/restore/:version')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Restore a user role' })
    @ApiOkResponse({ description: 'The record has been successfully restored', type: UserRole })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Not found' })
    async restore(
        @Req() req: Request,
        @Param('id') id: string,
        @Param('version', ParseIntPipe) version: number,
    ): Promise<void> {
        const userId = getUserId(req);
        await this.service.restore(userId, id, version);
    }

    @Get('has-global-role/:roleType')
    async hasGlobalRole(@Param('userId') userId: string, @Param('roleType') roleType: RoleType): Promise<boolean> {
        return await this.service.hasGlobalRole(userId, roleType);
    }
}
