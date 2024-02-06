import { Test, TestingModule } from '@nestjs/testing';
import { LawsService } from './laws.service';

describe('LawsService', () => {
    let service: LawsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [LawsService],
        }).compile();

        service = module.get<LawsService>(LawsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
