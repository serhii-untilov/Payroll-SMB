import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockType, repositoryMockFactory } from '@/test';
import { Repository } from 'typeorm';
import { UserAccessService } from '../user-access/user-access.service';
import { PaymentType } from './entities/payment-type.entity';
import { PaymentTypeService } from './payment-type.service';

describe('PaymentTypeService', () => {
    let service: PaymentTypeService;
    let repoMock: MockType<Repository<PaymentType>>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PaymentTypeService,
                { provide: getRepositoryToken(PaymentType), useFactory: repositoryMockFactory },
                { provide: UserAccessService, useValue: createMock<UserAccessService>() },
            ],
        }).compile();

        service = module.get<PaymentTypeService>(PaymentTypeService);
        repoMock = module.get(getRepositoryToken(PaymentType));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(repoMock).toBeTruthy();
    });
});
