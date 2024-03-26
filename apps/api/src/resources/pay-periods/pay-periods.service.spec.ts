import { Test, TestingModule } from '@nestjs/testing';
import { PayPeriodsService } from './pay-periods.service';
import { PayPeriod } from './entities/pay-period.entity';
import { Repository } from 'typeorm';
import { MockType, repositoryMockFactory } from '@repo/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Company } from '../companies/entities/company.entity';

describe('PayPeriodsService', () => {
    let service: PayPeriodsService;
    let repoMock: MockType<Repository<PayPeriod>>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PayPeriodsService,
                {
                    provide: getRepositoryToken(PayPeriod),
                    useFactory: repositoryMockFactory,
                },
                {
                    provide: getRepositoryToken(User),
                    useFactory: repositoryMockFactory,
                },
                {
                    provide: getRepositoryToken(Company),
                    useFactory: repositoryMockFactory,
                },
            ],
        }).compile();

        service = module.get<PayPeriodsService>(PayPeriodsService);
        repoMock = module.get(getRepositoryToken(PayPeriod));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(repoMock).toBeTruthy();
    });
});
