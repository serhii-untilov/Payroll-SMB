import { AccessTokenGuard, RefreshTokenGuard } from '@/guards';
import { getRefreshToken, getUserId } from '@/utils';
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { ApiConflictResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { CreateUserDto } from './../resources/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { TokensDto } from './dto/tokens.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    @ApiConflictResponse({ status: '4XX', description: 'User already exists' })
    @ApiConflictResponse({ status: '5XX', description: 'User already exists' })
    async register(@Body() user: CreateUserDto): Promise<TokensDto> {
        return await this.authService.register(user);
    }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(@Body() user: AuthDto): Promise<TokensDto> {
        return await this.authService.login(user);
    }

    @UseGuards(AccessTokenGuard)
    @Get('logout')
    async logout(@Req() req: Request): Promise<null> {
        const userId = getUserId(req);
        return this.authService.logout(userId);
    }

    @UseGuards(RefreshTokenGuard)
    @Get('refresh')
    refreshTokens(@Req() req: Request) {
        const userId = getUserId(req);
        const refreshToken = getRefreshToken(req);
        return this.authService.refreshTokens(userId, refreshToken);
    }

    @HttpCode(HttpStatus.OK)
    @Post('demo')
    async demo(): Promise<AuthDto> {
        return await this.authService.demo();
    }
}
