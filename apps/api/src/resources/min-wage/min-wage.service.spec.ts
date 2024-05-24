import { Test, TestingModule } from '@nestjs/testing';
import { MinWageService } from './min-wage.service';
import { MockType, repositoryMockFactory } from '@repo/testing';
import { Repository } from 'typeorm';
import { MinWage } from './entities/min-wage.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AccessService } from '../access/access.service';
import { createMock } from '@golevelup/ts-jest';

describe('MinWageService', () => {
    let service: MinWageService;
    let repoMock: MockType<Repository<MinWage>>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                MinWageService,
                { provide: getRepositoryToken(MinWage), useFactory: repositoryMockFactory },
                { provide: AccessService, useValue: createMock<AccessService>() },
            ],
        }).compile();

        service = module.get<MinWageService>(MinWageService);
        repoMock = module.get(getRepositoryToken(MinWage));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(repoMock).toBeTruthy();
    });
});
