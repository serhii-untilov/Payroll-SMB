import { randCountry } from '@ngneat/falso';
import { Test, TestingModule } from '@nestjs/testing';
import { LawsController } from './laws.controller';
import { LawsService } from './laws.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { createMockLaw, repositoryMockFactory } from '@repo/utils';
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

    it('should create a law', async () => {
        const law = createMockLaw();
        jest.spyOn(service, 'create').mockReturnValue(Promise.resolve(law));
        const res = await controller.create(law);
        expect(res).toStrictEqual(law);
    });

    it('should get law details', async () => {
        const law = createMockLaw();
        jest.spyOn(service, 'findOne').mockReturnValue(Promise.resolve(law));
        const res = await controller.findOne(law.id);
        expect(res).toStrictEqual(law);
    });

    it('should update a law', async () => {
        const law = createMockLaw();
        const newName = randCountry();
        const updatedLaw = { ...law, name: newName };
        jest.spyOn(service, 'update').mockReturnValue(Promise.resolve(updatedLaw));
        const res = await controller.update(law.id, { name: newName });
        expect(res).toStrictEqual(updatedLaw);
    });

    it('should remove a law', async () => {
        const law = createMockLaw();
        jest.spyOn(service, 'remove').mockReturnValue(Promise.resolve(law));
        const res = await controller.remove(law.id);
        expect(res).toStrictEqual(law);
    });
});
