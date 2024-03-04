import { Test, TestingModule } from '@nestjs/testing';
import { PaymentTypesController } from './payment-types.controller';
import { PaymentTypesService } from './payment-types.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PaymentType } from './entities/payment-type.entity';
import { repositoryMockFactory } from '@repo/utils';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

describe('PaymentTypesController', () => {
    let controller: PaymentTypesController;
    let service: PaymentTypesService;
    let usersService: UsersService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PaymentTypesController],
            providers: [
                PaymentTypesService,
                UsersService,
                {
                    provide: getRepositoryToken(PaymentType),
                    useFactory: repositoryMockFactory,
                },
                {
                    provide: getRepositoryToken(User),
                    useFactory: repositoryMockFactory,
                },
            ],
        }).compile();

        controller = module.get<PaymentTypesController>(PaymentTypesController);
        service = module.get<PaymentTypesService>(PaymentTypesService);
        usersService = module.get<UsersService>(UsersService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(service).toBeDefined();
        expect(usersService).toBeDefined();
    });
});
