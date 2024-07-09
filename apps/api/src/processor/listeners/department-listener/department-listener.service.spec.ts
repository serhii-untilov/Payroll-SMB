import { SseService } from '@/processor/serverSentEvents/sse.service';
import { TaskGenerationService } from '@/processor/taskGeneration/taskGeneration.service';
import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { DepartmentListenerService } from './department-listener.service';

describe('DepartmentListenerService', () => {
    let service: DepartmentListenerService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DepartmentListenerService,
                {
                    provide: TaskGenerationService,
                    useValue: createMock<TaskGenerationService>(),
                },
                {
                    provide: SseService,
                    useValue: createMock<SseService>(),
                },
            ],
        }).compile();

        service = module.get<DepartmentListenerService>(DepartmentListenerService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
