import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPublicUserData, IUser } from '@repo/shared';
import * as _ from 'lodash';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserCompany } from './entities/user-company.entity';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(UserCompany)
        private userCompanyRepository: Repository<UserCompany>,
    ) {}

    async create(user: CreateUserDto): Promise<User> {
        return await this.usersRepository.save(user);
    }

    async findAll(): Promise<User[]> {
        return await this.usersRepository.find();
    }

    async findOne(params): Promise<User> {
        const user = this.usersRepository.findOne(params);
        if (!user) {
            throw new NotFoundException(`User could not be found.`);
        }
        return user;
    }

    async findOneBy(
        where: FindOptionsWhere<User> | FindOptionsWhere<User>[],
    ): Promise<User | null> {
        return this.usersRepository.findOneBy(where);
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

    public static toPublic(user: IUser): IPublicUserData {
        const publicUser = _.omit(user, ['password', 'refreshToken']);
        return publicUser;
    }

    async getUserCompanyList(id: number, relations: boolean): Promise<UserCompany[]> {
        return await this.userCompanyRepository.find({
            where: { userId: id },
            ...(relations ? { relations: { company: true, role: true } } : {}),
        });
    }

    async getUserCompanyRole({ userId, companyId }): Promise<string> {
        const record = await this.userCompanyRepository.findOne({
            where: { userId, companyId },
            relations: { role: true },
        });
        return record?.role?.type;
    }
}
