import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { randEmail } from '@ngneat/falso';
import { MockType, createMockUser, repositoryMockFactory } from '@repo/testing';
import * as _ from 'lodash';
import { Repository } from 'typeorm';
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
                {
                    provide: getRepositoryToken(User),
                    useFactory: repositoryMockFactory,
                },
                {
                    provide: getRepositoryToken(UserCompany),
                    useFactory: repositoryMockFactory,
                },
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

    it('should be able to create a user', async () => {
        const user = createMockUser();
        const createUser: CreateUserDto = _.omit(user, ['id', 'isActive', 'refreshToken']);
        repoUsersMock.findOne?.mockReturnValue(null);
        repoUsersMock.save?.mockReturnValue(createUser);
        const newUser = await usersService.create(createUser);
        expect(newUser).toStrictEqual(createUser);
        expect(repoUsersMock.save).toHaveBeenCalled();
    });

    it('should successfully find a user', async () => {
        const user = createMockUser();
        repoUsersMock.findOne?.mockReturnValue(user);
        const params = { where: { id: user.id } };
        expect(await usersService.findOne(params)).toStrictEqual(user);
        expect(repoUsersMock.findOne).toHaveBeenCalledWith(params);
    });

    it('should throw if a user could not be found', async () => {
        repoUsersMock.findOneBy?.mockImplementation(() => null);
        try {
            await usersService.findOne(-1);
        } catch (err) {
            expect(err).toBeInstanceOf(NotFoundException);
        }
    });

    it('should find a user by email', async () => {
        const user = createMockUser();
        repoUsersMock.findOneBy?.mockReturnValue(user);
        expect(await usersService.findOneBy({ email: user.email })).toStrictEqual(user);
        expect(repoUsersMock.findOneBy).toHaveBeenCalledWith({ email: user.email });
    });

    it('should throw if a user could not be found by email', async () => {
        repoUsersMock.findOneBy?.mockImplementation(() => null);
        try {
            await usersService.findOneBy({ email: 'foo' });
        } catch (err) {
            expect(err).toBeInstanceOf(NotFoundException);
        }
    });

    it('should update a user if it exists', async () => {
        const user = createMockUser();
        const newEmail = randEmail();
        repoUsersMock.findOneBy?.mockReturnValue(user);
        repoUsersMock.save?.mockReturnValue({ ...user, email: newEmail });
        repoUsersMock.findOneOrFail?.mockReturnValue({ ...user, email: newEmail });
        const res = await usersService.update(user.id, { email: newEmail });
        expect(res).toStrictEqual({ ...user, email: newEmail });
    });

    it('should throw if a user could not be found during update', async () => {
        repoUsersMock.findOneBy?.mockImplementation(() => null);
        try {
            await usersService.update(0, {});
        } catch (err) {
            expect(err).toBeInstanceOf(NotFoundException);
        }
    });

    it('should remove a user if it exists', async () => {
        const user = createMockUser();
        repoUsersMock.findOneBy?.mockReturnValue(user);
        const res = await usersService.remove(user.id);
        expect(res).toStrictEqual(user);
    });

    it('should throw if a user could not be found during remove', async () => {
        repoUsersMock.findOneBy?.mockImplementation(() => null);
        try {
            await usersService.remove(-1);
        } catch (err) {
            expect(err).toBeInstanceOf(NotFoundException);
        }
    });
});
