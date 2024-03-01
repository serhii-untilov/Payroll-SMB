import { Test, TestingModule } from '@nestjs/testing';
import { AccountingController } from './accounting.controller';
import { AccountingService } from './accounting.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Accounting } from './entities/accounting.entity';
import { repositoryMockFactory } from '@repo/utils';

describe('AccountingController', () => {
    let controller: AccountingController;
    let service: AccountingService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AccountingController],
            providers: [
                AccountingService,
                {
                    provide: getRepositoryToken(Accounting),
                    useFactory: repositoryMockFactory,
                },
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
