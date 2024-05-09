import { UsersCompanyService } from './users-company.service';
import { createMock } from '@golevelup/ts-jest';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { randEmail } from '@ngneat/falso';
import { MockType, createMockUser, repositoryMockFactory } from '@repo/testing';
import * as _ from 'lodash';
import { Repository } from 'typeorm';
import { AccessService } from '../access/access.service';
import { RolesService } from '../roles/roles.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserCompany } from './entities/user-company.entity';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
    let usersService: UsersService;
    let repoUsersMock: MockType<Repository<User>>;
    let repoUserCompanyMock: MockType<Repository<UserCompany>>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                UsersCompanyService,
                { provide: getRepositoryToken(User), useFactory: repositoryMockFactory },
                { provide: getRepositoryToken(UserCompany), useFactory: repositoryMockFactory },
                { provide: AccessService, useValue: createMock<AccessService>() },
                { provide: RolesService, useValue: createMock<RolesService>() },
            ],
        }).compile();

        usersService = module.get<UsersService>(UsersService);
        repoUsersMock = module.get(getRepositoryToken(User));
        repoUserCompanyMock = module.get(getRepositoryToken(UserCompany));
    });

    it('should be defined', () => {
        expect(usersService).toBeDefined();
        expect(repoUsersMock).toBeTruthy();
        expect(repoUserCompanyMock).toBeTruthy();
    });

    it.skip('should be able to create a user', async () => {
        const user = createMockUser();
        const createUser: CreateUserDto = _.omit(user, ['id', 'isActive', 'refreshToken']);
        repoUsersMock.findOneBy?.mockReturnValue(null);
        repoUsersMock.save?.mockReturnValue(createUser);
        const newUser = await usersService.create(0, createUser);
        expect(newUser).toStrictEqual(createUser);
        expect(repoUsersMock.save).toHaveBeenCalled();
    });

    it.skip('should successfully find a user', async () => {
        const user = createMockUser();
        repoUsersMock.findOne?.mockReturnValue(user);
        const params = { where: { id: user.id } };
        expect(await usersService.findOne({ where: { id: user.id } })).toStrictEqual(user);
        expect(repoUsersMock.findOne).toHaveBeenCalledWith(params);
    });

    it.skip('should throw if a user could not be found', async () => {
        repoUsersMock.findOneBy?.mockImplementation(() => null);
        try {
            await usersService.findOne({ where: { id: -1 } });
        } catch (err) {
            expect(err).toBeInstanceOf(NotFoundException);
        }
    });

    it.skip('should find a user by email', async () => {
        const user = createMockUser();
        repoUsersMock.findOneBy?.mockReturnValue(user);
        expect(await usersService.findOne({ where: { email: user.email } })).toStrictEqual(user);
        expect(repoUsersMock.findOneBy).toHaveBeenCalledWith({ email: user.email });
    });

    it.skip('should throw if a user could not be found by email', async () => {
        repoUsersMock.findOneBy?.mockImplementation(() => null);
        try {
            await usersService.findOne({ where: { email: 'foo' } });
        } catch (err) {
            expect(err).toBeInstanceOf(NotFoundException);
        }
    });

    it.skip('should update a user if it exists', async () => {
        const user = createMockUser();
        const newEmail = randEmail();
        repoUsersMock.findOneBy?.mockReturnValue(user);
        repoUsersMock.save?.mockReturnValue({ ...user, email: newEmail });
        repoUsersMock.findOneOrFail?.mockReturnValue({ ...user, email: newEmail });
        const res = await usersService.update(0, user.id, { email: newEmail });
        expect(res).toStrictEqual({ ...user, email: newEmail });
    });

    it.skip('should throw if a user could not be found during update', async () => {
        repoUsersMock.findOneBy?.mockImplementation(() => null);
        try {
            await usersService.update(0, 0, {});
        } catch (err) {
            expect(err).toBeInstanceOf(NotFoundException);
        }
    });

    it.skip('should remove a user if it exists', async () => {
        const user = createMockUser();
        repoUsersMock.findOneBy?.mockReturnValue(user);
        const res = await usersService.remove(0, user.id);
        expect(res).toStrictEqual(user);
    });

    it.skip('should throw if a user could not be found during remove', async () => {
        repoUsersMock.findOneBy?.mockImplementation(() => null);
        try {
            await usersService.remove(0, -1);
        } catch (err) {
            expect(err).toBeInstanceOf(NotFoundException);
        }
    });
});
