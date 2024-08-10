import { AccessTokenGuard, RefreshTokenGuard } from '@/guards';
import { getRefreshToken, getUserId } from '@/utils';
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { CreateUserDto } from './../resources/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { TokensDto } from './dto/tokens.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ type: TokensDto, description: 'The user is registered' })
    // @ApiConflictResponse({ status: '4XX', description: 'The User is already exists' })
    // @ApiBadGatewayResponse({ description: 'The User is already exists' })
    async register(@Body() user: CreateUserDto): Promise<TokensDto> {
        return await this.authService.register(user);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
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

    @Post('demo')
    @HttpCode(HttpStatus.OK)
    async demo(): Promise<AuthDto> {
        return await this.authService.demo();
    }
}
