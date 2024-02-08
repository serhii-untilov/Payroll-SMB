import { randCountry } from '@ngneat/falso';
import { Test, TestingModule } from '@nestjs/testing';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { createMockRole, repositoryMockFactory } from '@repo/utils';
import { Role } from './entities/role.entity';

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
            ],
        }).compile();

        controller = module.get<RolesController>(RolesController);
        service = module.get<RolesService>(RolesService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(service).toBeDefined();
    });

    it('should create a role', async () => {
        const role = createMockRole();
        jest.spyOn(service, 'create').mockReturnValue(Promise.resolve(role));
        const res = await controller.create({ name: role.name });
        expect(res).toStrictEqual(role);
    });

    it('should get role details', async () => {
        const role = createMockRole();
        jest.spyOn(service, 'findOne').mockReturnValue(Promise.resolve(role));
        const res = await controller.findOne(role.id.toString());
        expect(res).toStrictEqual(role);
    });

    it('should update a role', async () => {
        const role = createMockRole();
        const newName = randCountry();
        const updatedRole = { ...role, name: newName };
        jest.spyOn(service, 'update').mockReturnValue(Promise.resolve(updatedRole));
        const res = await controller.update(role.id.toString(), { name: newName });
        expect(res).toStrictEqual(updatedRole);
    });

    it('should remove a role', async () => {
        const role = createMockRole();
        jest.spyOn(service, 'remove').mockReturnValue(Promise.resolve(role));
        const res = await controller.remove(role.id.toString());
        expect(res).toStrictEqual(role);
    });
});
