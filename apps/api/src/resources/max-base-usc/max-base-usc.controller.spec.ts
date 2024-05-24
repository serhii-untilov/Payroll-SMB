import { Test, TestingModule } from '@nestjs/testing';
import { MaxBaseUscController } from './max-base-usc.controller';
import { MaxBaseUscService } from './max-base-usc.service';
import { MockType, repositoryMockFactory } from '@repo/testing';
import { Repository } from 'typeorm';
import { MaxBaseUSC } from './entities/max-base-usc.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AccessService } from '../access/access.service';
import { createMock } from '@golevelup/ts-jest';

describe('MaxBaseUscController', () => {
    let controller: MaxBaseUscController;
    let repoMock: MockType<Repository<MaxBaseUSC>>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [MaxBaseUscController],
            providers: [
                MaxBaseUscService,
                { provide: getRepositoryToken(MaxBaseUSC), useFactory: repositoryMockFactory },
                { provide: AccessService, useValue: createMock<AccessService>() },
            ],
        }).compile();

        controller = module.get<MaxBaseUscController>(MaxBaseUscController);
        repoMock = module.get(getRepositoryToken(MaxBaseUSC));
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(repoMock).toBeTruthy();
    });
});
