import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockType, repositoryMockFactory } from 'test';
import { Repository } from 'typeorm';
import { AccessService } from '../access/access.service';
import { MinWage } from './entities/min-wage.entity';
import { MinWageController } from './min-wage.controller';
import { MinWageService } from './min-wage.service';

describe('MinWageController', () => {
    let controller: MinWageController;
    let repoMock: MockType<Repository<MinWage>>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [MinWageController],
            providers: [
                MinWageService,
                { provide: getRepositoryToken(MinWage), useFactory: repositoryMockFactory },
                { provide: AccessService, useValue: createMock<AccessService>() },
            ],
        }).compile();

        controller = module.get<MinWageController>(MinWageController);
        repoMock = module.get(getRepositoryToken(MinWage));
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(repoMock).toBeTruthy();
    });
});
