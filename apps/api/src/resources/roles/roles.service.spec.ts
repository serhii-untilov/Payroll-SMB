import { randCountry } from '@ngneat/falso';
import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from './roles.service';
import { Role } from './entities/role.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { createMockRole, repositoryMockFactory } from 'test';
import { MockType } from 'test';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { NotFoundException } from '@nestjs/common';
import { AccessService } from '../access/access.service';
import { createMock } from '@golevelup/ts-jest';

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
                { provide: AccessService, useValue: createMock<AccessService>() },
            ],
        }).compile();

        service = module.get<RolesService>(RolesService);
        repoMock = module.get(getRepositoryToken(Role));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(repoMock).toBeTruthy();
    });

    it.skip('should be able to create a role', async () => {
        const role = createMockRole();
        const createRole: CreateRoleDto = role;
        repoMock.findOne?.mockReturnValue(null);
        repoMock.save?.mockReturnValue(role);
        const newRole = await service.create(0, createRole);
        expect(newRole).toStrictEqual(role);
        expect(repoMock.save).toHaveBeenCalled();
    });

    it.skip('should successfully find a role', async () => {
        const role = createMockRole();
        repoMock.findOneBy?.mockReturnValue(role);
        expect(await service.findOne(0, role.id)).toStrictEqual(role);
        expect(repoMock.findOneBy).toHaveBeenCalledWith({ id: role.id });
    });

    it.skip('should throw if a role could not be found', async () => {
        repoMock.findOneBy?.mockImplementation(() => null);
        try {
            await service.findOne(0, -1);
        } catch (err) {
            expect(err).toBeInstanceOf(NotFoundException);
        }
    });

    it.skip('should update a role if it exists', async () => {
        const role = createMockRole();
        const newName = randCountry();
        repoMock.findOneBy?.mockReturnValue(role);
        repoMock.save?.mockReturnValue({ ...role, name: newName });
        repoMock.findOneOrFail?.mockReturnValue({ ...role, name: newName });
        const res = await service.update(0, role.id, { name: newName });
        expect(res).toStrictEqual({ ...role, name: newName });
    });

    it.skip('should throw if a role could not be found during update', async () => {
        repoMock.findOneBy?.mockImplementation(() => null);
        try {
            await service.update(0, 0, {});
        } catch (err) {
            expect(err).toBeInstanceOf(NotFoundException);
        }
    });

    it.skip('should remove a role if it exists', async () => {
        const role = createMockRole();
        repoMock.findOneBy?.mockReturnValue(role);
        const res = await service.remove(0, role.id);
        expect(res).toStrictEqual(role);
    });

    it.skip('should throw if a role could not be found during remove', async () => {
        repoMock.findOneBy?.mockImplementation(() => null);
        try {
            await service.remove(0, -1);
        } catch (err) {
            expect(err).toBeInstanceOf(NotFoundException);
        }
    });
});
