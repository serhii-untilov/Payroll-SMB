import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { randUser } from '@ngneat/falso';
import { Request } from 'express';
import * as _ from 'lodash';
import { createMockUser, repositoryMockFactory } from 'test';
import { AccessService } from '../access/access.service';
import { RolesService } from '../roles/roles.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
    let controller: UsersController;
    let service: UsersService;
    let accessService: AccessService;
    let rolesService: RolesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                UsersService,
                { provide: getRepositoryToken(User), useFactory: repositoryMockFactory },
                { provide: AccessService, useValue: createMock<AccessService>() },
                { provide: RolesService, useValue: createMock<RolesService>() },
            ],
        }).compile();

        controller = module.get<UsersController>(UsersController);
        service = module.get<UsersService>(UsersService);
        accessService = module.get<AccessService>(AccessService);
        rolesService = module.get<RolesService>(RolesService);
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
