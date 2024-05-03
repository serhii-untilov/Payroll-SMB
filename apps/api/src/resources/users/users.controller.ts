import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    ParseIntPipe,
    HttpCode,
    HttpStatus,
    Req,
    ParseBoolPipe,
    Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IPublicUserData, IUserCompany } from '@repo/shared';
import { AccessTokenGuard } from '../../guards/accessToken.guard';
import { Request } from 'express';
import { UsersCompanyService } from './users-company.service';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly usersCompanyService: UsersCompanyService,
    ) {}

    @Post()
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async create(@Req() req: Request, @Body() payload: CreateUserDto): Promise<IPublicUserData> {
        const userId: number = req.user['sub'];
        const user = await this.usersService.create(userId, payload);
        return UsersService.toPublic(user);
    }

    @Get()
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findAll(
        @Req() req: Request,
        @Query('relations', ParseBoolPipe) relations: boolean,
    ): Promise<IPublicUserData[]> {
        const userId: number = req.user['sub'];
        const users = await this.usersService.findAll(userId, { relations: { role: relations } });
        return users.map((user) => UsersService.toPublic(user));
    }

    @HttpCode(HttpStatus.OK)
    @UseGuards(AccessTokenGuard)
    @Get('user')
    async getCurrentUser(
        @Req() req: Request,
        @Query('relations', ParseBoolPipe) relations: boolean,
    ): Promise<IPublicUserData> {
        const id: number = req.user['sub'];
        const user = await this.usersService.findOne({
            where: { id },
            relations: { role: relations },
        });
        return UsersService.toPublic(user);
    }

    @Get(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findOne(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: number,
        @Query('relations', ParseBoolPipe) relations?: boolean,
    ): Promise<IPublicUserData> {
        const user = await this.usersService.findOne({
            where: { id },
            relations: { role: relations },
        });
        return UsersService.toPublic(user);
    }

    @Patch(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async update(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: UpdateUserDto,
    ): Promise<IPublicUserData> {
        const userId = req.user['sub'];
        const user = await this.usersService.update(userId, id, payload);
        return UsersService.toPublic(user);
    }

    @Delete(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async remove(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<IPublicUserData> {
        const userId = req.user['sub'];
        const user = await this.usersService.remove(userId, id);
        return UsersService.toPublic(user);
    }

    @Get(':id/companies')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async userCompanyList(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: number,
        @Query('relations', ParseBoolPipe) relations: boolean,
    ): Promise<IUserCompany[]> {
        const userId = req.user['sub'];
        return await this.usersCompanyService.getUserCompanyList(userId, id, relations);
    }
}
