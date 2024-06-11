import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { TaskGenerationService } from '../../taskGeneration/taskGeneration.service';
import { DepartmentListenerService } from './department-listener.service';
import { SseService } from './../../serverSentEvents/sse.service';

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
