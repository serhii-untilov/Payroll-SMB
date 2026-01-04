import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockType, createMockLaw, repositoryMockFactory } from 'test';
import { Repository } from 'typeorm';
import { Law } from './entities/law.entity';
import { LawsService } from './laws.service';

describe('LawsService', () => {
    let service: LawsService;
    let repoMock: MockType<Repository<Law>>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [LawsService, { provide: getRepositoryToken(Law), useFactory: repositoryMockFactory }],
        }).compile();

        service = module.get<LawsService>(LawsService);
        repoMock = module.get(getRepositoryToken(Law));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(repoMock).toBeTruthy();
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
});
