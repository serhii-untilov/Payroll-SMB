import { Test, TestingModule } from '@nestjs/testing';
import { PaymentTypesService } from './payment-types.service';
import { MockType, repositoryMockFactory } from '@repo/testing';
import { Repository } from 'typeorm';
import { PaymentType } from './entities/payment-type.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('PaymentTypesService', () => {
    let service: PaymentTypesService;
    let repoMock: MockType<Repository<PaymentType>>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PaymentTypesService,
                {
                    provide: getRepositoryToken(PaymentType),
                    useFactory: repositoryMockFactory,
                },
            ],
        }).compile();

        service = module.get<PaymentTypesService>(PaymentTypesService);
        repoMock = module.get(getRepositoryToken(PaymentType));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(repoMock).toBeTruthy();
    });
});
