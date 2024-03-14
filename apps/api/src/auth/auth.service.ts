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
import { CreateUserDto } from '../resources/users/dto/create-user.dto';
import { TokensDto } from './dto/tokens.dto';
import { AuthDto } from './dto/auth.dto';
import { User } from '../resources/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    async register(user: CreateUserDto): Promise<TokensDto> {
        const exists = await this.usersRepository.findOneBy({ email: user.email });
        if (exists) {
            throw new ConflictException('User already exists.');
        }
        const { password } = user;
        const hashedPassword = await this.hashData(password);
        const newUser = await this.usersRepository.save({ ...user, password: hashedPassword });
        const tokens = await this.getTokens(newUser.id, newUser.email);
        await this.updateRefreshToken(newUser.id, tokens.refreshToken);
        return tokens;
    }

    async login(auth: AuthDto): Promise<TokensDto> {
        const user = await this.usersRepository.findOneBy({ email: auth.email });
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
        this.usersRepository.save({ id: userId, refreshToken: null });
        return null;
    }

    async hashData(data) {
        return await bcrypt.hash(data, 10);
    }

    async updateRefreshToken(userId: number, refreshToken: string | null) {
        const hashedRefreshToken = refreshToken ? await this.hashData(refreshToken) : null;
        await this.usersRepository.save({ id: userId, refreshToken: hashedRefreshToken });
        return this.usersRepository.findOneBy({ id: userId });
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
        const user = await this.usersRepository.findOneBy({ id: userId });
        if (!user || !user.refreshToken) throw new ForbiddenException('Access Denied');
        // const refreshTokenMatches = await argon2.verify(user.refreshToken, refreshToken);
        const refreshTokenMatches = await bcrypt.compare(refreshToken, user.refreshToken);
        if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
        const tokens = await this.getTokens(user.id, user.email);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        return tokens;
    }
}
