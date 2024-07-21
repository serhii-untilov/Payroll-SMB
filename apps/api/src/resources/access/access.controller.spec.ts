import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from 'test';
import { AccessController } from './access.controller';
import { AccessService } from './access.service';
import { Access } from './entities/access.entity';

describe('AccessController', () => {
    let controller: AccessController;
    let service: AccessService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AccessController],
            providers: [
                AccessService,
                { provide: getRepositoryToken(Access), useFactory: repositoryMockFactory },
            ],
        }).compile();

        controller = module.get<AccessController>(AccessController);
        service = module.get<AccessService>(AccessService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(service).toBeDefined();
    });
});
