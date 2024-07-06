import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AccessTokenGuard } from '../guards/accessToken.guard';
import { RefreshTokenGuard } from '../guards/refreshToken.guard';
import { CreateUserDto } from '../resources/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { TokensDto } from './dto/tokens.dto';
import { getUserId } from 'src/utils/getUserId';
import { getRefreshToken } from 'src/utils/getRefreshToken';

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
        const userId = getUserId(req);
        return this.authService.logout(userId);
    }

    @HttpCode(HttpStatus.OK)
    @UseGuards(RefreshTokenGuard)
    @Get('refresh')
    refreshTokens(@Req() req: Request) {
        const userId = getUserId(req);
        const refreshToken = getRefreshToken(req);
        return this.authService.refreshTokens(userId, refreshToken);
    }

    @HttpCode(HttpStatus.OK)
    @Post('preview')
    async demo(): Promise<AuthDto> {
        return await this.authService.demo();
    }
}
