import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

type JwtPayload = {
    sub: string;
    username: string;
};

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor() {
        super({
            useFactory: (config: ConfigService) => ({
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                secretOrKey: config.getOrThrow<string>('auth.accessSecret'),
            }),
            inject: [ConfigService],
        });
    }

    validate(payload: JwtPayload) {
        return payload;
    }
}
