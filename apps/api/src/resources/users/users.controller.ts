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
    ParseBoolPipe,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    getSchemaPath,
} from '@nestjs/swagger';
import { Request } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { FindOneUserDto } from './dto/find-one-user.dto';
import { PublicUserDataDto } from './dto/public-user-date.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
@ApiBearerAuth()
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Create a user' })
    @ApiCreatedResponse({
        description: 'The record has been successfully created',
        type: PublicUserDataDto,
    })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async create(@Req() req: Request, @Body() payload: CreateUserDto): Promise<PublicUserDataDto> {
        const userId: number = getUserId(req);
        const user = await this.usersService.create(userId, payload);
        return this.usersService.toPublic(user);
    }

    @Get()
    @UseGuards(AccessTokenGuard)
    @ApiOkResponse({
        description: 'The found records',
        schema: { type: 'array', items: { $ref: getSchemaPath(User) } },
    })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async findAll(
        @Req() req: Request,
        @Query('relations', new ParseBoolPipe({ optional: true })) relations: boolean,
    ): Promise<PublicUserDataDto[]> {
        const userId: number = getUserId(req);
        const users = await this.usersService.findAll(userId, { relations: { role: !!relations } });
        return users.map((user) => this.usersService.toPublic(user));
    }

    @Post('current')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ description: 'The found record', type: User })
    @ApiNotFoundResponse({ description: 'Record not found' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async findCurrent(
        @Req() req: Request,
        @Body() params: FindOneUserDto,
    ): Promise<PublicUserDataDto> {
        const id: number = getUserId(req);
        const user = await this.usersService.findOneOrFail({
            where: { id },
            relations: { role: !!params.relations },
        });
        return this.usersService.toPublic(user);
    }

    @Get(':id')
    @UseGuards(AccessTokenGuard)
    @ApiOkResponse({ description: 'The found record', type: User })
    @ApiNotFoundResponse({ description: 'Record not found' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    async findOne(
        @Param('id', ParseIntPipe) id: number,
        @Query('relations', new ParseBoolPipe({ optional: true })) relations?: boolean,
    ): Promise<PublicUserDataDto> {
        const user = await this.usersService.findOneOrFail({
            where: { id },
            relations: { role: !!relations },
        });
        return this.usersService.toPublic(user);
    }

    @Patch(':id')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Update user' })
    @ApiOkResponse({ description: 'The updated record', type: User })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Not found' })
    async update(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: UpdateUserDto,
    ): Promise<PublicUserDataDto> {
        const userId = getUserId(req);
        const user = await this.usersService.update(userId, id, payload);
        return this.usersService.toPublic(user);
    }

    @Delete(':id')
    @UseGuards(AccessTokenGuard)
    @ApiOperation({ summary: 'Soft delete a user' })
    @ApiOkResponse({
        description: 'The record has been successfully deleted',
        type: PublicUserDataDto,
    })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Not found' })
    async remove(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<PublicUserDataDto> {
        const userId = getUserId(req);
        const user = await this.usersService.remove(userId, id);
        return this.usersService.toPublic(user);
    }
}
