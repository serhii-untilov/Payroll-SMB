import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
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
        return UsersService.toPublic(user);
    }

    @Get()
    @UseGuards(AccessTokenGuard)
    async findAll(): Promise<IPublicUserData[]> {
        const users = await this.usersService.findAll();
        return users.map((user) => UsersService.toPublic(user));
    }

    @Get(':id')
    @UseGuards(AccessTokenGuard)
    async findOne(@Param('id') id: string): Promise<IPublicUserData> {
        const user = await this.usersService.findOne({ where: { id: +id } });
        return UsersService.toPublic(user);
    }

    @Patch(':id')
    @UseGuards(AccessTokenGuard)
    async update(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<IPublicUserData> {
        const user = await this.usersService.update(+id, updateUserDto);
        return UsersService.toPublic(user);
    }

    @Delete(':id')
    @UseGuards(AccessTokenGuard)
    async remove(@Param('id') id: string): Promise<IPublicUserData> {
        const user = await this.usersService.remove(+id);
        return UsersService.toPublic(user);
    }
}
