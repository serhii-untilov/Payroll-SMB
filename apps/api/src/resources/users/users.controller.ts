import { UserCompany } from './entities/user-company.entity';
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
import { AccessTokenGuard } from '@/guards/accessToken.guard';
import { Request } from 'express';
import { UsersCompanyService } from './users-company.service';
import { getUserId } from '@/utils/getUserId';

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
        const userId: number = getUserId(req);
        const user = await this.usersService.create(userId, payload);
        return UsersService.toPublic(user);
    }

    @Get()
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findAll(
        @Req() req: Request,
        @Query('relations', new ParseBoolPipe({ optional: true })) relations: boolean,
    ): Promise<IPublicUserData[]> {
        const userId: number = getUserId(req);
        const users = await this.usersService.findAll(userId, { relations: { role: !!relations } });
        return users.map((user) => UsersService.toPublic(user));
    }

    @Get('user')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async getCurrentUser(
        @Req() req: Request,
        @Query('relations', new ParseBoolPipe({ optional: true })) relations: boolean,
    ): Promise<IPublicUserData> {
        const id: number = getUserId(req);
        const user = await this.usersService.findOne({
            where: { id },
            relations: { role: !!relations },
        });
        return UsersService.toPublic(user);
    }

    @Get(':id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async findOne(
        @Param('id', ParseIntPipe) id: number,
        @Query('relations', new ParseBoolPipe({ optional: true })) relations?: boolean,
    ): Promise<IPublicUserData> {
        const user = await this.usersService.findOne({
            where: { id },
            relations: { role: !!relations },
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
        const userId = getUserId(req);
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
        const userId = getUserId(req);
        const user = await this.usersService.remove(userId, id);
        return UsersService.toPublic(user);
    }

    @Get(':id/companies')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async userCompanyList(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: number,
        @Query('relations', new ParseBoolPipe({ optional: true })) relations: boolean,
        @Query('deleted', new ParseBoolPipe({ optional: true })) deleted: boolean,
    ): Promise<IUserCompany[]> {
        const userId = getUserId(req);
        return await this.usersCompanyService.getUserCompanyList(
            userId,
            id,
            !!relations,
            !!deleted,
        );
    }

    @Delete('/company/:id')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async userCompanyRemove(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<UserCompany> {
        const userId = getUserId(req);
        return await this.usersCompanyService.remove(userId, id);
    }

    @Post('/company/:id/restore')
    @UseGuards(AccessTokenGuard)
    @HttpCode(HttpStatus.OK)
    async userCompanyRestore(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<UserCompany> {
        const userId = getUserId(req);
        return await this.usersCompanyService.restore(userId, id);
    }
}
