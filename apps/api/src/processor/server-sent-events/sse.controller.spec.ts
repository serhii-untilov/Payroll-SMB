import { Test, TestingModule } from '@nestjs/testing';
import { SseController } from './sse.controller';
import { SseService } from './sse.service';

describe('SseController', () => {
    let controller: SseController;
    let service: SseService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [SseController],
            providers: [SseService],
        }).compile();

        controller = module.get<SseController>(SseController);
        service = module.get<SseService>(SseService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(service).toBeDefined();
    });
});
