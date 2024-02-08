import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { IRole } from '@repo/shared';

@Controller('roles')
export class RolesController {
    constructor(private readonly rolesService: RolesService) {}

    @Post()
    async create(@Body() createRoleDto: CreateRoleDto): Promise<IRole> {
        return await this.rolesService.create(createRoleDto);
    }

    @Get()
    async findAll(): Promise<IRole[]> {
        return await this.rolesService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<IRole> {
        return await this.rolesService.findOne(+id);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto): Promise<IRole> {
        return await this.rolesService.update(+id, updateRoleDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<IRole> {
        return await this.rolesService.remove(+id);
    }
}
