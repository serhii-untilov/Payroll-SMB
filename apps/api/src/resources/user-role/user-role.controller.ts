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
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import {
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    getSchemaPath,
} from '@nestjs/swagger';
import { Request } from 'express';
import { FindUserRoleDto } from './dto';
import { CreateUserRoleDto } from './dto/create-user-role.dto';
import { UserRole } from './entities/user-role.entity';
import { UserRoleService } from './user-role.service';

@Controller('user-roles')
export class UserRoleController {
    constructor(private readonly service: UserRoleService) {}

    @Post()
    @UseGuards(AccessTokenGuard)
    @ApiCreatedResponse({
        description: 'The found records',
        schema: { type: 'array', items: { $ref: getSchemaPath(UserRole) } },
    })
    async create(@Req() req: Request, dto: CreateUserRoleDto): Promise<string> {
        const userId = getUserId(req);
        return await this.service.create(userId, dto);
    }

    @Post('find')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        description: 'The found records',
        schema: { type: 'array', items: { $ref: getSchemaPath(UserRole) } },
    })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async findAll(@Req() req: Request, @Body() dto: FindUserRoleDto): Promise<UserRole[]> {
        const userId = getUserId(req);
        return await this.service.findAll(userId, dto);
    }

    @Post('find/:id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ description: 'The found record' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async findOne(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: string,
        @Body() params: FindUserRoleDto,
    ): Promise<UserRole> {
        const userId = getUserId(req);
        return await this.service.findOne(id, params);
    }

    @Delete(':id/:version')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Soft delete a User Company record' })
    @ApiOkResponse({ description: 'The record has been successfully deleted', type: UserRole })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Not found' })
    async remove(@Req() req: Request, @Param('id') id: string, @Param('version', ParseIntPipe) version: number) {
        const userId = getUserId(req);
        await this.service.remove(userId, id, version);
    }

    @Post('restore/:id/:version')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Restore a User Company record' })
    @ApiOkResponse({ description: 'The record has been successfully restored', type: UserRole })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Not found' })
    async restore(@Req() req: Request, @Param('id') id: string, @Param('version', ParseIntPipe) version: number) {
        const userId = getUserId(req);
        await this.service.restore(userId, id, version);
    }

    @Get('has-global-role/:roleType')
    async hasGlobalRole(@Param('userId') userId: string, @Param('roleType') roleType: RoleType): Promise<boolean> {
        return await this.service.hasGlobalRole(userId, roleType);
    }
}
