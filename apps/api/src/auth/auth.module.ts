import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccessTokenStrategy } from './strategies/lib/access-token.strategy';
import { RefreshTokenStrategy } from './strategies/lib/refresh-token.strategy';
import { UserAccessModule } from '../resources/user-access/user-access.module';
import { UserModule } from '../resources/user/user.module';

@Module({
    imports: [JwtModule.register({}), forwardRef(() => UserModule), forwardRef(() => UserAccessModule)],
    controllers: [AuthController],
    providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
})
export class AuthModule {}
