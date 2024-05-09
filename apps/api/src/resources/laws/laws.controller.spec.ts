import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { createMockLaw, repositoryMockFactory } from '@repo/testing';
import { Law } from './entities/law.entity';
import { LawsController } from './laws.controller';
import { LawsService } from './laws.service';

describe('LawsController', () => {
    let controller: LawsController;
    let service: LawsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [LawsController],
            providers: [
                LawsService,
                { provide: getRepositoryToken(Law), useFactory: repositoryMockFactory },
            ],
        }).compile();

        controller = module.get<LawsController>(LawsController);
        service = module.get<LawsService>(LawsService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(service).toBeDefined();
    });

    it('should get law details', async () => {
        const law = createMockLaw();
        jest.spyOn(service, 'findOne').mockReturnValue(Promise.resolve(law));
        const res = await controller.findOne(law.id);
        expect(res).toStrictEqual(law);
    });
});
