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
import { IRole } from '@repo/shared';
import { Request } from 'express';
import { AccessTokenGuard } from '../../guards/accessToken.guard';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
    constructor(private readonly rolesService: RolesService) {}

    @Post()
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async create(@Req() req: Request, @Body() createRoleDto: CreateRoleDto): Promise<IRole> {
        const userId = req.user['sub'];
        return await this.rolesService.create(userId, createRoleDto);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(@Req() req: Request): Promise<IRole[]> {
        const userId = req.user['sub'];
        return await this.rolesService.findAll(userId);
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async findOne(@Req() req: Request, @Param('id', ParseIntPipe) id: number): Promise<IRole> {
        const userId = req.user['sub'];
        return await this.rolesService.findOne(userId, id);
    }

    @Patch(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async update(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: number,
        @Body() updateRoleDto: UpdateRoleDto,
    ): Promise<IRole> {
        const userId = req.user['sub'];
        return await this.rolesService.update(userId, id, updateRoleDto);
    }

    @Delete(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async remove(@Req() req: Request, @Param('id', ParseIntPipe) id: number): Promise<IRole> {
        const userId = req.user['sub'];
        return await this.rolesService.remove(userId, id);
    }
}
