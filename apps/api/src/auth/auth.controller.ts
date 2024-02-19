import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Request,
    UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { CreateUserDto } from '../resources/users/dto/create-user.dto';
import { TokensDto } from './dto/tokens.dto';
import { AccessTokenGuard } from '../guards/accessToken.guard';
import { RefreshTokenGuard } from '../guards/refreshToken.guard';
import { Request as Req } from 'express';
import { User } from '../resources/users/entities/user.entity';
import { UsersService } from '../resources/users/users.service';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private userService: UsersService,
    ) {}

    @HttpCode(HttpStatus.OK)
    @Post('register')
    async signUp(@Body() user: CreateUserDto): Promise<TokensDto> {
        return await this.authService.signUp(user);
    }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async signIn(@Body() user: AuthDto): Promise<TokensDto> {
        return await this.authService.signIn({ email: user.email, password: user.password });
    }

    @HttpCode(HttpStatus.OK)
    @UseGuards(AccessTokenGuard)
    @Get('logout')
    async logout(@Request() req: Req): Promise<null> {
        return this.authService.logout(req.user['sub']);
    }

    @UseGuards(RefreshTokenGuard)
    @Get('refresh')
    refreshTokens(@Request() req: Req) {
        const userId = req.user['sub'];
        const refreshToken = req.user['refreshToken'];
        return this.authService.refreshTokens(userId, refreshToken);
    }

    @HttpCode(HttpStatus.OK)
    @UseGuards(AccessTokenGuard)
    @Get('user')
    async getUser(@Request() req: Req): Promise<User> {
        return this.userService.findOne(req.user['sub']);
    }
}
