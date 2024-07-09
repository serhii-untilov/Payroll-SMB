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
import { AccessTokenGuard } from '@/guards/accessToken.guard';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RolesService } from './roles.service';
import { getUserId } from '@/utils/getUserId';

@Controller('roles')
export class RolesController {
    constructor(private readonly service: RolesService) {}

    @Post()
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async create(@Req() req: Request, @Body() payload: CreateRoleDto): Promise<IRole> {
        const userId = getUserId(req);
        return await this.service.create(userId, payload);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(@Req() req: Request): Promise<IRole[]> {
        const userId = getUserId(req);
        return await this.service.findAll(userId);
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async findOne(@Req() req: Request, @Param('id', ParseIntPipe) id: number): Promise<IRole> {
        const userId = getUserId(req);
        return await this.service.findOne(userId, id);
    }

    @Patch(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
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
    @HttpCode(HttpStatus.OK)
    async remove(@Req() req: Request, @Param('id', ParseIntPipe) id: number): Promise<IRole> {
        const userId = getUserId(req);
        return await this.service.remove(userId, id);
    }
}
