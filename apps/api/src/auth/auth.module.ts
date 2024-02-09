import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategies';
import { UsersModule } from '../resources/users/users.module';
import { ConfigService } from '@nestjs/config';

@Module({
    imports: [
        UsersModule,
        JwtModule.registerAsync({
            useFactory: (config: ConfigService) => ({
                global: true,
                secret: config.getOrThrow<string>('auth.accessSecret'),
                signOptions: {
                    expiresIn: config.get<string>('auth.accessExpiration') || '600s',
                },
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy, ConfigService],
})
export class AuthModule {}
