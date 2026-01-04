import { createMock } from '@golevelup/ts-jest';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { randEmail } from '@ngneat/falso';
import * as _ from 'lodash';
import { MockType, createMockUser, repositoryMockFactory } from 'test';
import { Repository } from 'typeorm';
import { AccessService } from '../access/access.service';
import { RolesService } from '../roles/roles.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

describe('UserService', () => {
    let userService: UserService;
    let repoUserMock: MockType<Repository<User>>;
    let userId: string = '1'; // Example userId for testing

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                { provide: getRepositoryToken(User), useFactory: repositoryMockFactory },
                { provide: AccessService, useValue: createMock<AccessService>() },
                { provide: RolesService, useValue: createMock<RolesService>() },
            ],
        }).compile();

        userService = module.get<UserService>(UserService);
        repoUserMock = module.get(getRepositoryToken(User));
    });

    it('should be defined', () => {
        expect(userService).toBeDefined();
        expect(repoUserMock).toBeTruthy();
    });

    it.skip('should be able to create a user', async () => {
        const user = createMockUser();
        const createUser: CreateUserDto = _.omit(user, ['id', 'isActive', 'refreshToken']);
        repoUserMock.findOneBy?.mockReturnValue(null);
        repoUserMock.save?.mockReturnValue(createUser);
        const newUser = await userService.create(userId, createUser);
        expect(newUser).toStrictEqual(createUser);
        expect(repoUserMock.save).toHaveBeenCalled();
    });

    it.skip('should successfully find a user', async () => {
        const user = createMockUser();
        repoUserMock.findOne?.mockReturnValue(user);
        const params = { where: { id: user.id } };
        expect(await userService.findOne({ where: { id: user.id } })).toStrictEqual(user);
        expect(repoUserMock.findOne).toHaveBeenCalledWith(params);
    });

    it.skip('should throw if a user could not be found', async () => {
        repoUserMock.findOneBy?.mockImplementation(() => null);
        try {
            await userService.findOne({ where: { id: -1 } });
        } catch (err) {
            expect(err).toBeInstanceOf(NotFoundException);
        }
    });

    it.skip('should find a user by email', async () => {
        const user = createMockUser();
        repoUserMock.findOneBy?.mockReturnValue(user);
        expect(await userService.findOne({ where: { email: user.email } })).toStrictEqual(user);
        expect(repoUserMock.findOneBy).toHaveBeenCalledWith({ email: user.email });
    });

    it.skip('should throw if a user could not be found by email', async () => {
        repoUserMock.findOneBy?.mockImplementation(() => null);
        try {
            await userService.findOne({ where: { email: 'foo' } });
        } catch (err) {
            expect(err).toBeInstanceOf(NotFoundException);
        }
    });

    it.skip('should update a user if it exists', async () => {
        const user = createMockUser();
        const newEmail = randEmail();
        repoUserMock.findOneBy?.mockReturnValue(user);
        repoUserMock.save?.mockReturnValue({ ...user, email: newEmail });
        repoUserMock.findOneOrFail?.mockReturnValue({ ...user, email: newEmail });
        const res = await userService.update(0, user.id, { email: newEmail });
        expect(res).toStrictEqual({ ...user, email: newEmail });
    });

    it.skip('should throw if a user could not be found during update', async () => {
        repoUserMock.findOneBy?.mockImplementation(() => null);
        try {
            await userService.update(0, 0, {});
        } catch (err) {
            expect(err).toBeInstanceOf(NotFoundException);
        }
    });

    it.skip('should remove a user if it exists', async () => {
        const user = createMockUser();
        repoUserMock.findOneBy?.mockReturnValue(user);
        const res = await userService.remove(0, user.id);
        expect(res).toStrictEqual(user);
    });

    it.skip('should throw if a user could not be found during remove', async () => {
        repoUserMock.findOneBy?.mockImplementation(() => null);
        try {
            await userService.remove(0, -1);
        } catch (err) {
            expect(err).toBeInstanceOf(NotFoundException);
        }
    });
});
