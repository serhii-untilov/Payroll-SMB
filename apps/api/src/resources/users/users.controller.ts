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
} from '@nestjs/common';
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
    @HttpCode(HttpStatus.OK)
    async create(@Body() createUserDto: CreateUserDto): Promise<IPublicUserData> {
        const user = await this.usersService.create(createUserDto);
        return UsersService.toPublic(user);
    }

    @Get()
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findAll(): Promise<IPublicUserData[]> {
        const users = await this.usersService.findAll();
        return users.map((user) => UsersService.toPublic(user));
    }

    @Get(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<IPublicUserData> {
        const user = await this.usersService.findOne({ where: { id } });
        return UsersService.toPublic(user);
    }

    @Patch(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<IPublicUserData> {
        const user = await this.usersService.update(id, updateUserDto);
        return UsersService.toPublic(user);
    }

    @Delete(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async remove(@Param('id', ParseIntPipe) id: number): Promise<IPublicUserData> {
        const user = await this.usersService.remove(id);
        return UsersService.toPublic(user);
    }
}
