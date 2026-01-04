import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { randCountry } from '@ngneat/falso';
import { Request } from 'express';
import { createMockRole, repositoryMockFactory } from 'test';
import { Role } from './entities/role.entity';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';

describe('RoleController', () => {
    let controller: RoleController;
    let service: RoleService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [RoleController],
            providers: [
                RoleService,
                {
                    provide: getRepositoryToken(Role),
                    useFactory: repositoryMockFactory,
                },
            ],
        }).compile();

        controller = module.get<RoleController>(RoleController);
        service = module.get<RoleService>(RoleService);
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
        jest.spyOn(service, 'update').mockReturnValue(Promise.resolve(void 0));
        const res = await controller.update({ body: {} } as any as Request, role.id, {
            name: newName,
        });
        expect(res).toStrictEqual(updatedRole);
    });

    it.skip('should remove a role', async () => {
        const role = createMockRole();
        jest.spyOn(service, 'remove').mockReturnValue(Promise.resolve(void 0));
        const res = await controller.remove({ body: {} } as any as Request, role.id);
        expect(res).toStrictEqual(role);
    });
});
