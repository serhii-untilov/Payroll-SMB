import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { CreateUserDto } from '../resources/users/dto/create-user.dto';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @HttpCode(HttpStatus.OK)
    @Post('register')
    signUp(@Body() user: CreateUserDto) {
        return this.authService.signUp(user);
    }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() user: AuthDto) {
        return this.authService.signIn(user.name, user.password);
    }

    @HttpCode(HttpStatus.OK)
    @Get('logout')
    logout(@Req() req: Request) {
        this.authService.logout(req.user['sub']);
    }
}
