import { Test, TestingModule } from '@nestjs/testing';
import { SummaryCalculationService } from './summaryCalculation.service';

describe('SummaryCalculationService', () => {
    let service: SummaryCalculationService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [SummaryCalculationService],
        }).compile();

        service = module.get<SummaryCalculationService>(SummaryCalculationService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
