import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { CreateUserDto } from '../resources/users/dto/create-user.dto';

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
    signIn(@Body() user: SignInDto) {
        return this.authService.signIn(user.name, user.password);
    }
}