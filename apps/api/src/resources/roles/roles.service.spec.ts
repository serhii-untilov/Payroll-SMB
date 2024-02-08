import { randCountry } from '@ngneat/falso';
import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from './roles.service';
import { Role } from './entities/role.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { createMockRole, repositoryMockFactory } from '@repo/utils';
import { MockType } from '@repo/utils';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { NotFoundException } from '@nestjs/common';

describe('RolesService', () => {
    let service: RolesService;
    let repoMock: MockType<Repository<Role>>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RolesService,
                {
                    provide: getRepositoryToken(Role),
                    useFactory: repositoryMockFactory,
                },
            ],
        }).compile();

        service = module.get<RolesService>(RolesService);
        repoMock = module.get(getRepositoryToken(Role));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(repoMock).toBeTruthy();
    });

    it('should be able to create a role', async () => {
        const role = createMockRole();
        const createRole: CreateRoleDto = { name: role.name };
        repoMock.findOne?.mockReturnValue(null);
        repoMock.save?.mockReturnValue(role);
        const newRole = await service.create(createRole);
        expect(newRole).toStrictEqual(role);
        expect(repoMock.save).toHaveBeenCalled();
    });

    it('should successfully find a role', async () => {
        const role = createMockRole();
        repoMock.findOneBy?.mockReturnValue(role);
        expect(await service.findOne(role.id)).toStrictEqual(role);
        expect(repoMock.findOneBy).toHaveBeenCalledWith({ id: role.id });
    });

    it('should throw if a role could not be found', async () => {
        repoMock.findOneBy?.mockImplementation(() => null);
        try {
            await service.findOne(-1);
        } catch (err) {
            expect(err).toBeInstanceOf(NotFoundException);
        }
    });

    it('should update a role if it exists', async () => {
        const role = createMockRole();
        const newName = randCountry();
        repoMock.findOneBy?.mockReturnValue(role);
        repoMock.save?.mockReturnValue({ ...role, name: newName });
        repoMock.findOneOrFail?.mockReturnValue({ ...role, name: newName });
        const res = await service.update(role.id, { name: newName });
        expect(res).toStrictEqual({ ...role, name: newName });
    });

    it('should throw if a role could not be found during update', async () => {
        repoMock.findOneBy?.mockImplementation(() => null);
        try {
            await service.update(0, {});
        } catch (err) {
            expect(err).toBeInstanceOf(NotFoundException);
        }
    });

    it('should remove a role if it exists', async () => {
        const role = createMockRole();
        repoMock.findOneBy?.mockReturnValue(role);
        const res = await service.remove(role.id);
        expect(res).toStrictEqual(role);
    });

    it('should throw if a role could not be found during remove', async () => {
        repoMock.findOneBy?.mockImplementation(() => null);
        try {
            await service.remove(-1);
        } catch (err) {
            expect(err).toBeInstanceOf(NotFoundException);
        }
    });
});
