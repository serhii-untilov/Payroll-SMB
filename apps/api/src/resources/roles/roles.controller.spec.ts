import { randCountry } from '@ngneat/falso';
import { Test, TestingModule } from '@nestjs/testing';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { createMockRole, repositoryMockFactory } from 'test';
import { Role } from './entities/role.entity';
import { Request } from 'express';
import { AccessService } from '../access/access.service';
import { createMock } from '@golevelup/ts-jest';

describe('RolesController', () => {
    let controller: RolesController;
    let service: RolesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [RolesController],
            providers: [
                RolesService,
                {
                    provide: getRepositoryToken(Role),
                    useFactory: repositoryMockFactory,
                },
                { provide: AccessService, useValue: createMock<AccessService>() },
            ],
        }).compile();

        controller = module.get<RolesController>(RolesController);
        service = module.get<RolesService>(RolesService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(service).toBeDefined();
    });

    it.skip('should create a role', async () => {
        const role = createMockRole();
        jest.spyOn(service, 'create').mockReturnValue(Promise.resolve(role));
        const res = await controller.create({ body: {} } as any as Request, role);
        expect(res).toStrictEqual(role);
    });

    it.skip('should get role details', async () => {
        const role = createMockRole();
        jest.spyOn(service, 'findOne').mockReturnValue(Promise.resolve(role));
        const res = await controller.findOne({ body: {} } as any as Request, role.id);
        expect(res).toStrictEqual(role);
    });

    it.skip('should update a role', async () => {
        const role = createMockRole();
        const newName = randCountry();
        const updatedRole = { ...role, name: newName };
        jest.spyOn(service, 'update').mockReturnValue(Promise.resolve(updatedRole));
        const res = await controller.update({ body: {} } as any as Request, role.id, {
            name: newName,
        });
        expect(res).toStrictEqual(updatedRole);
    });

    it.skip('should remove a role', async () => {
        const role = createMockRole();
        jest.spyOn(service, 'remove').mockReturnValue(Promise.resolve(role));
        const res = await controller.remove({ body: {} } as any as Request, role.id);
        expect(res).toStrictEqual(role);
    });
});
