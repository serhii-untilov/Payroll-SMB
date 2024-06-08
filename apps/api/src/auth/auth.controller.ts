import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AccessTokenGuard } from '../guards/accessToken.guard';
import { RefreshTokenGuard } from '../guards/refreshToken.guard';
import { CreateUserDto } from '../resources/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { TokensDto } from './dto/tokens.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @HttpCode(HttpStatus.OK)
    @Post('register')
    async register(@Body() user: CreateUserDto): Promise<TokensDto> {
        return await this.authService.register(user);
    }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(@Body() user: AuthDto): Promise<TokensDto> {
        return await this.authService.login(user);
    }

    @HttpCode(HttpStatus.OK)
    @UseGuards(AccessTokenGuard)
    @Get('logout')
    async logout(@Req() req: Request): Promise<null> {
        return this.authService.logout(req.user['sub']);
    }

    @HttpCode(HttpStatus.OK)
    @UseGuards(RefreshTokenGuard)
    @Get('refresh')
    refreshTokens(@Req() req: Request) {
        const userId = req.user['sub'];
        const refreshToken = req.user['refreshToken'];
        return this.authService.refreshTokens(userId, refreshToken);
    }

    @HttpCode(HttpStatus.OK)
    @Post('preview')
    async demo(): Promise<AuthDto> {
        return await this.authService.demo();
    }
}
