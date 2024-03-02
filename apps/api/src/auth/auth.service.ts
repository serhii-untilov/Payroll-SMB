import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../resources/users/users.service';
import { CreateUserDto } from '../resources/users/dto/create-user.dto';
import { TokensDto } from './dto/tokens.dto';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    async signUp(user: CreateUserDto): Promise<TokensDto> {
        const exists = await this.usersService.findOneBy([{ email: user.email }]);
        if (exists) {
            throw new ConflictException('User already exists.');
        }
        const { password } = user;
        const hashedPassword = await this.hashData(password);
        const newUser = await this.usersService.create({ ...user, password: hashedPassword });
        const tokens = await this.getTokens(newUser.id, newUser.email);
        await this.updateRefreshToken(newUser.id, tokens.refreshToken);
        return tokens;
    }

    async signIn(auth: AuthDto): Promise<TokensDto> {
        const user = await this.usersService.findOneBy({ email: auth.email });
        if (!user) {
            throw new BadRequestException('User not found');
        }
        if (!(await bcrypt.compare(auth.password, user.password))) {
            throw new UnauthorizedException('Password is incorrect');
        }
        const tokens = await this.getTokens(user.id, user.email, !auth.rememberMe);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        return tokens;
    }

    async logout(userId: number): Promise<null> {
        this.usersService.update(userId, { refreshToken: null });
        return null;
    }

    async hashData(data) {
        return await bcrypt.hash(data, 10);
    }

    async updateRefreshToken(userId: number, refreshToken: string | null) {
        const hashedRefreshToken = refreshToken ? await this.hashData(refreshToken) : null;
        await this.usersService.update(userId, {
            refreshToken: hashedRefreshToken,
        });
    }

    async getTokens(userId: number, email: string, skipRefreshToken?: boolean): Promise<TokensDto> {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(
                {
                    sub: userId,
                    email: email,
                },
                {
                    secret: this.configService.get<string>('auth.accessSecret'),
                    expiresIn: this.configService.get<string>('auth.accessExpiration'),
                },
            ),
            skipRefreshToken
                ? Promise.resolve(null)
                : this.jwtService.signAsync(
                      {
                          sub: userId,
                          email: email,
                      },
                      {
                          secret: this.configService.get<string>('auth.refreshSecret'),
                          expiresIn: this.configService.get<string>('auth.refreshExpiration'),
                      },
                  ),
        ]);

        return {
            accessToken,
            refreshToken,
        };
    }

    async refreshTokens(userId: number, refreshToken: string) {
        const user = await this.usersService.findOne({ where: { id: userId } });
        if (!user || !user.refreshToken) throw new ForbiddenException('Access Denied');
        // const refreshTokenMatches = await argon2.verify(user.refreshToken, refreshToken);
        const refreshTokenMatches = await bcrypt.compare(refreshToken, user.refreshToken);
        if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
        const tokens = await this.getTokens(user.id, user.email);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        return tokens;
    }
}
