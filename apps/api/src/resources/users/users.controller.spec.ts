import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { randUser } from '@ngneat/falso';
import { createMockUser, repositoryMockFactory } from '@repo/utils';
import * as _ from 'lodash';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

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
        const publicUser = UsersService.toPublic(user);
        jest.spyOn(service, 'create').mockReturnValue(Promise.resolve(user));
        const createUserDto: CreateUserDto = _.omit(user, ['id']);
        const res = await controller.create(createUserDto);
        expect(res).toStrictEqual(publicUser);
    });

    it('should get user details', async () => {
        const user = createMockUser();
        const publicUser = UsersService.toPublic(user);
        jest.spyOn(service, 'findOne').mockReturnValue(Promise.resolve(user));
        const res = await controller.findOne(user.id.toString());
        expect(res).toStrictEqual(publicUser);
    });

    it('should update an user', async () => {
        const user = createMockUser();
        const newUser = randUser();
        const updatedUser = {
            ...user,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
        };
        const publicUser = UsersService.toPublic(user);
        jest.spyOn(service, 'update').mockReturnValue(Promise.resolve(updatedUser));
        const res = await controller.update(user.id.toString(), {
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
        });
        expect(res).toStrictEqual(publicUser);
    });

    it('should remove a user', async () => {
        const user = createMockUser();
        const publicUser = UsersService.toPublic(user);
        jest.spyOn(service, 'remove').mockReturnValue(Promise.resolve(user));
        const res = await controller.remove(user.id.toString());
        expect(res).toStrictEqual(publicUser);
    });
});
