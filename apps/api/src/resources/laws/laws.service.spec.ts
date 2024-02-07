import { Test, TestingModule } from '@nestjs/testing';
import { LawsService } from './laws.service';
import { Law } from './entities/law.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from '@repo/utils';
import { MockType } from '@repo/utils';
import { Repository } from 'typeorm';

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
});
