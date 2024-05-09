import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockType, repositoryMockFactory } from '@repo/testing';
import { Repository } from 'typeorm';
import { AccessService } from '../access/access.service';
import { PaymentType } from './entities/payment-type.entity';
import { PaymentTypesService } from './payment-types.service';

describe('PaymentTypesService', () => {
    let service: PaymentTypesService;
    let repoMock: MockType<Repository<PaymentType>>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PaymentTypesService,
                { provide: getRepositoryToken(PaymentType), useFactory: repositoryMockFactory },
                { provide: AccessService, useValue: createMock<AccessService>() },
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
