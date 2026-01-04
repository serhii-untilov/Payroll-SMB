import { AccessService, UserService } from '@/resources';
import { Action, Resource, RoleType } from '@/types';
import {
    BadRequestException,
    ForbiddenException,
    HttpException,
    HttpStatus,
    Inject,
    Injectable,
    UnauthorizedException,
    forwardRef,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './../resources/users/dto/create-user.dto';
import { AuthDto } from './dto/auth.dto';
import { TokensDto } from './dto/tokens.dto';

@Injectable()
export class AuthService {
    constructor(
        @Inject(forwardRef(() => UserService)) private usersService: UserService,
        @Inject(forwardRef(() => JwtService)) private jwtService: JwtService,
        @Inject(forwardRef(() => ConfigService)) private configService: ConfigService,
        @Inject(forwardRef(() => AccessService)) private accessService: AccessService,
    ) {}

    async register(user: CreateUserDto): Promise<TokensDto> {
        const exists = await this.usersService.findOne({
            where: { email: user.email },
        });
        if (exists) {
            throw new HttpException(`User '${user.email}' already exists`, HttpStatus.CONFLICT);
        }
        const { password } = user;
        const hashedPassword = await this.hashData(password);
        const newUser = await this.usersService.register({
            ...user,
            password: hashedPassword,
        });
        const tokens = await this.getTokens(newUser.id, newUser.email);
        await this.updateRefreshToken(newUser.id, tokens.refreshToken);
        return tokens;
    }

    async login(auth: AuthDto): Promise<TokensDto> {
        const user = await this.usersService.findOne({
            where: { email: auth.email },
        });
        if (!user) {
            throw new BadRequestException('User not found');
        }
        if (!(await bcrypt.compare(auth.password, user.passwordHash))) {
            throw new UnauthorizedException('Password is incorrect');
        }
        const tokens = await this.getTokens(user.id, user.email, !auth.rememberMe);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        return tokens;
    }

    async logout(userId: string): Promise<null> {
        this.usersService.update(userId, userId, { refreshToken: null });
        return null;
    }

    private async hashData(data) {
        return await bcrypt.hash(data, 10);
    }

    private async updateRefreshToken(userId: string, refreshToken: string | null) {
        const hashedRefreshToken = refreshToken ? await this.hashData(refreshToken) : null;
        await this.usersService.update(userId, userId, { refreshToken: hashedRefreshToken });
        return this.usersService.findOne({ where: { id: userId } });
    }

    private async getTokens(userId: string, email: string, skipRefreshToken?: boolean): Promise<TokensDto> {
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

    async refreshTokens(userId: string, refreshToken: string) {
        const user = await this.usersService.findOne({ where: { id: userId } });
        if (!user || !user.refreshToken) throw new ForbiddenException('Access Denied');
        // const refreshTokenMatches = await argon2.verify(user.refreshToken, refreshToken);
        const refreshTokenMatches = await bcrypt.compare(refreshToken, user.refreshToken);
        if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
        const tokens = await this.getTokens(user.id, user.email);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        return tokens;
    }

    async demo(): Promise<AuthDto> {
        await this.accessService.availableForRoleTypeOrFail(RoleType.Accountant, Resource.Demo, Action.Read);
        if (process.env['DEMO_AVAILABLE'] === 'true') {
            return {
                email: process.env['DEMO_LOGIN'] || '',
                password: process.env['DEMO_PASSWORD'] || '',
                rememberMe: true,
            };
        }
        return {
            email: '',
            password: '',
            rememberMe: false,
        };
    }
}
