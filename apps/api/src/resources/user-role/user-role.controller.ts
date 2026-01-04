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
import { RoleType } from '@/types';

@Controller('user-roles')
export class UserRoleController {
    constructor(private readonly service: UserRoleService) {}

    @Post()
    @UseGuards(AccessTokenGuard)
    @ApiCreatedResponse({
        description: 'The found records',
        schema: { type: 'array', items: { $ref: getSchemaPath(UserRole) } },
    })
    async create(@Req() req: Request, payload: CreateUserRoleDto): Promise<UserRole> {
        const userId = getUserId(req);
        await this.service.availableCreateOrFail(userId);
        return await this.service.create(userId, payload);
    }

    @Post('find')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        description: 'The found records',
        schema: { type: 'array', items: { $ref: getSchemaPath(UserRole) } },
    })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async findAll(@Req() req: Request, @Body() params: FindUserRoleDto): Promise<UserRole[]> {
        const userId = getUserId(req);
        this.service.availableFindAllOrFail(userId);
        return await this.service.findAll(params);
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
        this.service.availableFindAllOrFail(userId);
        return await this.service.findOne(id, params);
    }

    @Delete(':id')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Soft delete a User Company record' })
    @ApiOkResponse({ description: 'The record has been successfully deleted', type: UserRole })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Not found' })
    async remove(@Req() req: Request, @Param('id', ParseIntPipe) id: string): Promise<UserRole> {
        const userId = getUserId(req);
        await this.service.availableDeleteOrFail(userId);
        return await this.service.remove(userId, id);
    }

    @Post(':id/restore')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Restore a User Company record' })
    @ApiOkResponse({ description: 'The record has been successfully restored', type: UserRole })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Not found' })
    async restore(@Req() req: Request, @Param('id', ParseIntPipe) id: string): Promise<UserRole> {
        const userId = getUserId(req);
        return await this.service.restore(userId, id);
    }

    @Get('has-global-role/:roleType')
    async hasGlobalRole(@Param('userId') userId: string, @Param('roleType') roleType: RoleType): Promise<boolean> {
        return await this.service.hasGlobalRole(userId, roleType);
    }
}
