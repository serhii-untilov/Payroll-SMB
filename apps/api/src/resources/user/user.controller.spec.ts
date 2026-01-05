import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { randUser } from '@ngneat/falso';
import { Request } from 'express';
import * as _ from 'lodash';
import { createMockUser, repositoryMockFactory } from 'test';
import { UserAccessService } from '../user-access/user-access.service';
import { RoleService } from '../role/role.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
    let controller: UserController;
    let service: UserService;
    let accessService: UserAccessService;
    let rolesService: RoleService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [
                UserService,
                { provide: getRepositoryToken(User), useFactory: repositoryMockFactory },
                { provide: UserAccessService, useValue: createMock<UserAccessService>() },
                { provide: RoleService, useValue: createMock<RoleService>() },
            ],
        }).compile();

        controller = module.get<UserController>(UserController);
        service = module.get<UserService>(UserService);
        accessService = module.get<UserAccessService>(UserAccessService);
        rolesService = module.get<RoleService>(RoleService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(service).toBeDefined();
        expect(accessService).toBeDefined();
        expect(rolesService).toBeDefined();
    });

    it.skip('should create a user', async () => {
        const user = createMockUser();
        const publicUser = service.toPublic(user);
        jest.spyOn(service, 'create').mockReturnValue(Promise.resolve(user));
        const payload: CreateUserDto = _.omit(user, ['id']);
        const res = await controller.create({ body: payload } as any as Request, payload);
        expect(res).toStrictEqual(publicUser);
    });

    it.skip('should get user details', async () => {
        const user = createMockUser();
        const publicUser = service.toPublic(user);
        jest.spyOn(service, 'findOne').mockReturnValue(Promise.resolve(user));
        const res = await controller.findOne(user.id);
        expect(res).toStrictEqual(publicUser);
    });

    it.skip('should update an user', async () => {
        const user = createMockUser();
        const newUser = randUser();
        const updatedUser = {
            ...user,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
        };
        const publicUser = service.toPublic(updatedUser);
        jest.spyOn(service, 'update').mockReturnValue(Promise.resolve(updatedUser));
        const payload: UpdateUserDto = _.omit(user, ['id']);
        const res = await controller.update({ body: payload } as any as Request, user.id, {
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
        });
        expect(res).toStrictEqual(publicUser);
    });

    it.skip('should remove a user', async () => {
        const user = createMockUser();
        const publicUser = service.toPublic(user);
        jest.spyOn(service, 'remove').mockReturnValue(Promise.resolve(user));
        const res = await controller.remove({ body: {} } as any as Request, user.id);
        expect(res).toStrictEqual(publicUser);
    });
});
