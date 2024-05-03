import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from '@repo/testing';
import { AccountingController } from './accounting.controller';
import { AccountingService } from './accounting.service';
import { Accounting } from './entities/accounting.entity';

describe('AccountingController', () => {
    let controller: AccountingController;
    let service: AccountingService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AccountingController],
            providers: [
                AccountingService,
                { provide: getRepositoryToken(Accounting), useFactory: repositoryMockFactory },
            ],
        }).compile();

        controller = module.get<AccountingController>(AccountingController);
        service = module.get<AccountingService>(AccountingService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(service).toBeDefined();
    });
});
