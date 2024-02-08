import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../resources/users/users.service';
import { ICreateUser } from '@repo/shared';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async signUp(createUserDto: ICreateUser): Promise<{ access_token: string }> {
        const exists = await this.usersService.findOneBy({ name: createUserDto.name });
        if (exists) {
            throw new ConflictException('User already exists.');
        }
        const user = await this.usersService.create(createUserDto);
        const payload = { sub: user.id, username: user.name };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }

    async signIn(name: string, pass: string): Promise<{ access_token: string }> {
        const user = await this.usersService.findOneBy({ name });
        if (!user || !(await bcrypt.compare(pass, user.password))) {
            throw new UnauthorizedException();
        }
        const payload = { sub: user.id, username: user.name };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
}
