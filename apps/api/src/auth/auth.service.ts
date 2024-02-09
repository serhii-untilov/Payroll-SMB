import {
    BadRequestException,
    ConflictException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../resources/users/users.service';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from '../resources/users/dto/create-user.dto';
import { TokensDto } from './dto/auth.dto';

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

    async signIn(name: string, pass: string): Promise<{ access_token: string }> {
        const user = await this.usersService.findOneBy({ name });
        if (!user) {
            throw new BadRequestException();
        }
        if (!(await bcrypt.compare(pass, user.password))) {
            throw new UnauthorizedException('Password is incorrect');
        }
        const payload = { sub: user.id, username: user.name };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }

    async logout(userId: number) {
        return this.usersService.update(userId, { refreshToken: null });
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
}
