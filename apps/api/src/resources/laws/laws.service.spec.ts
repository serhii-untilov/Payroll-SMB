import { randCountry } from '@ngneat/falso';
import { Test, TestingModule } from '@nestjs/testing';
import { LawsService } from './laws.service';
import { Law } from './entities/law.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { createMockLaw, repositoryMockFactory } from '@repo/utils';
import { MockType } from '@repo/utils';
import { Repository } from 'typeorm';
import { CreateLawDto } from './dto/create-law.dto';
import { NotFoundException } from '@nestjs/common';

describe('LawsService', () => {
    let service: LawsService;
    let repoMock: MockType<Repository<Law>>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                LawsService,
                {
                    provide: getRepositoryToken(Law),
                    useFactory: repositoryMockFactory,
                },
            ],
        }).compile();

        service = module.get<LawsService>(LawsService);
        repoMock = module.get(getRepositoryToken(Law));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(repoMock).toBeTruthy();
    });

    it('should be able to create a law', async () => {
        const law = createMockLaw();
        const createLaw: CreateLawDto = { name: law.name };
        repoMock.findOne?.mockReturnValue(null);
        repoMock.save?.mockReturnValue(law);
        const newLaw = await service.create(createLaw);
        expect(newLaw).toStrictEqual(law);
        expect(repoMock.save).toHaveBeenCalled();
    });

    it('should successfully find a law', async () => {
        const law = createMockLaw();
        repoMock.findOneBy?.mockReturnValue(law);
        expect(await service.findOne(law.id)).toStrictEqual(law);
        expect(repoMock.findOneBy).toHaveBeenCalledWith({ id: law.id });
    });

    it('should throw if a law could not be found', async () => {
        repoMock.findOneBy?.mockImplementation(() => null);
        try {
            await service.findOne(-1);
        } catch (err) {
            expect(err).toBeInstanceOf(NotFoundException);
        }
    });

    it('should update a law if it exists', async () => {
        const law = createMockLaw();
        const newName = randCountry();
        repoMock.findOneBy?.mockReturnValue(law);
        repoMock.save?.mockReturnValue({ ...law, name: newName });
        repoMock.findOneOrFail?.mockReturnValue({ ...law, name: newName });
        const res = await service.update(law.id, { name: newName });
        expect(res).toStrictEqual({ ...law, name: newName });
    });

    it('should throw if a law could not be found during update', async () => {
        repoMock.findOneBy?.mockImplementation(() => null);
        try {
            await service.update(0, {});
        } catch (err) {
            expect(err).toBeInstanceOf(NotFoundException);
        }
    });

    it('should remove a law if it exists', async () => {
        const law = createMockLaw();
        repoMock.findOneBy?.mockReturnValue(law);
        const res = await service.remove(law.id);
        expect(res).toStrictEqual(law);
    });

    it('should throw if a law could not be found during remove', async () => {
        repoMock.findOneBy?.mockImplementation(() => null);
        try {
            await service.remove(-1);
        } catch (err) {
            expect(err).toBeInstanceOf(NotFoundException);
        }
    });
});
