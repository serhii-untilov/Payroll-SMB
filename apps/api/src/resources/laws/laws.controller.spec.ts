import { Test, TestingModule } from '@nestjs/testing';
import { LawsController } from './laws.controller';
import { LawsService } from './laws.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from '@repo/utils';
import { Law } from './entities/law.entity';

describe('LawsController', () => {
    let controller: LawsController;
    let service: LawsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [LawsController],
            providers: [
                LawsService,
                {
                    provide: getRepositoryToken(Law),
                    useFactory: repositoryMockFactory,
                },
            ],
        }).compile();

        controller = module.get<LawsController>(LawsController);
        service = module.get<LawsService>(LawsService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(service).toBeDefined();
    });
});
