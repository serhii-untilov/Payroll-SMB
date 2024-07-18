import { AccessModule, UsersModule } from '@/resources';
import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategies';

@Module({
    imports: [
        JwtModule.register({}),
        forwardRef(() => UsersModule),
        forwardRef(() => AccessModule),
    ],
    controllers: [AuthController],
    providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
})
export class AuthModule {}
