import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    async create(user: CreateUserDto): Promise<User> {
        const existing = await this.usersRepository.findOne({ where: { email: user.email } });
        if (existing) {
            throw new BadRequestException(`User '${user.email}' already exists.`);
        }
        const { email, password } = user;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await this.usersRepository.save({
            email,
            password: hashedPassword,
        });
        return newUser;
    }

    async findAll(): Promise<User[]> {
        return await this.usersRepository.find();
    }

    findOne(id: number) {
        const user = this.usersRepository.findOneBy({ id });
        if (!user) {
            throw new NotFoundException(`User could not be found.`);
        }
        return user;
    }

    findOneByEmail(email: string) {
        const user = this.usersRepository.findOneBy({ email });
        if (!user) {
            throw new NotFoundException(`User could not be found.`);
        }
        return user;
    }

    async update(id: number, data: UpdateUserDto): Promise<User> {
        const user = await this.usersRepository.findOneBy({ id });
        if (!user) {
            throw new NotFoundException(`User could not be found.`);
        }
        await this.usersRepository.save({ id, ...data });
        // re-query the database so that the updated record is returned
        const updated = await this.usersRepository.findOneOrFail({ where: { id } });
        return updated;
    }

    async remove(id: number): Promise<User> {
        const user = await this.usersRepository.findOneBy({ id });
        if (!user) {
            throw new NotFoundException(`User could not be found.`);
        }
        await this.usersRepository.remove(user);
        return user;
    }

    async delete(id: number): Promise<null> {
        const user = await this.usersRepository.findOneBy({ id });
        if (!user) {
            throw new NotFoundException(`User could not be found.`);
        }
        await this.usersRepository.remove(user);
        return null;
    }
}
