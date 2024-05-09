import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockType, repositoryMockFactory } from '@repo/testing';
import { Repository } from 'typeorm';
import { AccountingService } from './accounting.service';
import { Accounting } from './entities/accounting.entity';

describe('AccountingService', () => {
    let service: AccountingService;
    let repoMock: MockType<Repository<Accounting>>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AccountingService,
                {
                    provide: getRepositoryToken(Accounting),
                    useFactory: repositoryMockFactory,
                },
            ],
        }).compile();

        service = module.get<AccountingService>(AccountingService);
        repoMock = module.get(getRepositoryToken(Accounting));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(repoMock).toBeTruthy();
    });
});
