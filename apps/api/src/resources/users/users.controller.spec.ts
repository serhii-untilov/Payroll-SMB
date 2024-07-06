import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { randUser } from '@ngneat/falso';
import { createMockUser, repositoryMockFactory } from '@repo/testing';
import * as _ from 'lodash';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserCompany } from './entities/user-company.entity';
import { AccessService } from '../access/access.service';
import { createMock } from '@golevelup/ts-jest';
import { Request } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesService } from '../roles/roles.service';
import { UsersCompanyService } from './users-company.service';

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
                UsersCompanyService,
                { provide: getRepositoryToken(User), useFactory: repositoryMockFactory },
                { provide: getRepositoryToken(UserCompany), useFactory: repositoryMockFactory },
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
        const publicUser = UsersService.toPublic(user);
        jest.spyOn(service, 'create').mockReturnValue(Promise.resolve(user));
        const payload: CreateUserDto = _.omit(user, ['id']);
        const res = await controller.create({ body: payload } as any as Request, payload);
        expect(res).toStrictEqual(publicUser);
    });

    it.skip('should get user details', async () => {
        const user = createMockUser();
        const publicUser = UsersService.toPublic(user);
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
        const publicUser = UsersService.toPublic(updatedUser);
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
        const publicUser = UsersService.toPublic(user);
        jest.spyOn(service, 'remove').mockReturnValue(Promise.resolve(user));
        const res = await controller.remove({ body: {} } as any as Request, user.id);
        expect(res).toStrictEqual(publicUser);
    });
});
