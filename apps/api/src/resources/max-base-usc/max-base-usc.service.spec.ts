import { Test, TestingModule } from '@nestjs/testing';
import { MaxBaseUscService } from './max-base-usc.service';
import { MockType, repositoryMockFactory } from '@repo/testing';
import { Repository } from 'typeorm';
import { MaxBaseUSC } from './entities/max-base-usc.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AccessService } from '../access/access.service';
import { createMock } from '@golevelup/ts-jest';

describe('MaxBaseUscService', () => {
    let service: MaxBaseUscService;
    let repoMock: MockType<Repository<MaxBaseUSC>>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                MaxBaseUscService,
                { provide: getRepositoryToken(MaxBaseUSC), useFactory: repositoryMockFactory },
                { provide: AccessService, useValue: createMock<AccessService>() },
            ],
        }).compile();

        service = module.get<MaxBaseUscService>(MaxBaseUscService);
        repoMock = module.get(getRepositoryToken(MaxBaseUSC));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(repoMock).toBeTruthy();
    });
});
