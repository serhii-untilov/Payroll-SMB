import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import * as _ from 'lodash';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IPublicUserData } from '@repo/shared';
import { AccessTokenGuard } from '../../guards/accessToken.guard';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    @UseGuards(AccessTokenGuard)
    async create(@Body() createUserDto: CreateUserDto): Promise<IPublicUserData> {
        const user = await this.usersService.create(createUserDto);
        return _.omit(user, ['password', 'refreshToken']);
    }

    @Get()
    @UseGuards(AccessTokenGuard)
    async findAll(): Promise<IPublicUserData[]> {
        const users = await this.usersService.findAll();
        return users.map((user) => _.omit(user, ['password', 'refreshToken']));
    }

    @Get(':id')
    @UseGuards(AccessTokenGuard)
    async findOne(@Param('id') id: string): Promise<IPublicUserData> {
        const user = await this.usersService.findOne(+id);
        return _.omit(user, ['password', 'refreshToken']);
    }

    @Patch(':id')
    @UseGuards(AccessTokenGuard)
    async update(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<IPublicUserData> {
        const user = await this.usersService.update(+id, updateUserDto);
        return _.omit(user, ['password', 'refreshToken']);
    }

    @Delete(':id')
    @UseGuards(AccessTokenGuard)
    async remove(@Param('id') id: string): Promise<IPublicUserData> {
        const user = await this.usersService.remove(+id);
        return _.omit(user, ['password', 'refreshToken']);
    }
}
