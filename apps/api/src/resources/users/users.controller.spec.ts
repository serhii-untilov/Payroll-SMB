import { randEmail } from '@ngneat/falso';
import { Test, TestingModule } from '@nestjs/testing';
import * as _ from 'lodash';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { createMockUser, repositoryMockFactory } from '@repo/utils';
import { IPublicUserData } from '@repo/shared';

describe('UsersController', () => {
    let controller: UsersController;
    let service: UsersService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                UsersService,
                {
                    provide: getRepositoryToken(User),
                    useFactory: repositoryMockFactory,
                },
            ],
        }).compile();

        controller = module.get<UsersController>(UsersController);
        service = module.get<UsersService>(UsersService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(service).toBeTruthy();
    });

    it('should create a user', async () => {
        const user = createMockUser();
        const publicUser: IPublicUserData = _.omit(user, ['password', 'refreshToken']);
        jest.spyOn(service, 'create').mockReturnValue(Promise.resolve(user));
        const res = await controller.create({
            name: user.name,
            email: user.email,
            password: user.password,
            roles: [],
        });
        expect(res).toStrictEqual(publicUser);
    });

    it('should get user details', async () => {
        const user = createMockUser();
        const publicUser: IPublicUserData = _.omit(user, ['password', 'refreshToken']);
        jest.spyOn(service, 'findOne').mockReturnValue(Promise.resolve(user));
        const res = await controller.findOne(user.id.toString());
        expect(res).toStrictEqual(publicUser);
    });

    it('should update an user', async () => {
        const user = createMockUser();
        const newEmail = randEmail();
        const updatedUser = { ...user, name: newEmail, email: newEmail };
        const publicUser: IPublicUserData = _.omit(updatedUser, ['password', 'refreshToken']);
        jest.spyOn(service, 'update').mockReturnValue(Promise.resolve(updatedUser));
        const res = await controller.update(user.id.toString(), {
            name: newEmail,
            email: newEmail,
        });
        expect(res).toStrictEqual(publicUser);
    });

    it('should remove a user', async () => {
        const user = createMockUser();
        const publicUser: IPublicUserData = _.omit(user, ['password', 'refreshToken']);
        jest.spyOn(service, 'remove').mockReturnValue(Promise.resolve(user));
        const res = await controller.remove(user.id.toString());
        expect(res).toStrictEqual(publicUser);
    });
});
