import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../resources/users/users.service';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from '../resources/users/dto/create-user.dto';
import { TokensDto } from './dto/tokens.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    async signUp(user: CreateUserDto): Promise<TokensDto> {
        const exists = await this.usersService.findOneBy([
            { name: user.name },
            { email: user.email },
        ]);
        if (exists) {
            throw new ConflictException('User already exists.');
        }
        const { password } = user;
        const hashedPassword = await this.hashData(password);
        const newUser = await this.usersService.create({ ...user, password: hashedPassword });
        const tokens = await this.getTokens(newUser.id, newUser.name);
        await this.updateRefreshToken(newUser.id, tokens.refreshToken);
        return tokens;
    }

    async signIn(name: string, pass: string): Promise<TokensDto> {
        const user = await this.usersService.findOneBy({ name });
        if (!user) {
            throw new BadRequestException();
        }
        if (!(await bcrypt.compare(pass, user.password))) {
            throw new UnauthorizedException('Password is incorrect');
        }
        const tokens = await this.getTokens(user.id, user.name);
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

    async updateRefreshToken(userId: number, refreshToken: string) {
        const hashedRefreshToken = await this.hashData(refreshToken);
        await this.usersService.update(userId, {
            refreshToken: hashedRefreshToken,
        });
    }

    async getTokens(userId: number, username: string): Promise<TokensDto> {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(
                {
                    sub: userId,
                    username,
                },
                {
                    secret: this.configService.get<string>('auth.accessSecret'),
                    expiresIn: this.configService.get<string>('auth.accessExpiration'),
                },
            ),
            this.jwtService.signAsync(
                {
                    sub: userId,
                    username,
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
        const user = await this.usersService.findOne(userId);
        if (!user || !user.refreshToken) throw new ForbiddenException('Access Denied');
        // const refreshTokenMatches = await argon2.verify(user.refreshToken, refreshToken);
        const refreshTokenMatches = await bcrypt.compare(refreshToken, user.refreshToken);
        if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
        const tokens = await this.getTokens(user.id, user.name);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        return tokens;
    }
}
