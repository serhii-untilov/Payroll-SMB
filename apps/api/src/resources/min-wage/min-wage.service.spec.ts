import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockType, repositoryMockFactory } from 'test';
import { Repository } from 'typeorm';
import { AccessService } from '../access/access.service';
import { MinWage } from './entities/min-wage.entity';
import { MinWageService } from './min-wage.service';

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
