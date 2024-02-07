import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import * as _ from 'lodash';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IPublicUserData } from '@repo/shared';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    async create(@Body() createUserDto: CreateUserDto): Promise<IPublicUserData> {
        const user = await this.usersService.create(createUserDto);
        return _.omit(user, ['password']);
    }

    @Get()
    async findAll(): Promise<IPublicUserData[]> {
        const users = await this.usersService.findAll();
        return users.map((user) => _.omit(user, ['password']));
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<IPublicUserData> {
        const user = await this.usersService.findOne(+id);
        return _.omit(user, ['password']);
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<IPublicUserData> {
        const user = await this.usersService.update(+id, updateUserDto);
        return _.omit(user, ['password']);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<IPublicUserData> {
        const user = await this.usersService.remove(+id);
        return _.omit(user, ['password']);
    }
}
