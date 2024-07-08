import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from '@repo/testing';
import { AccessService } from '../access/access.service';
import { PositionsService } from '../positions/positions.service';
import { Payroll } from './entities/payroll.entity';
import { PayrollsController } from './payrolls.controller';
import { PayrollsService } from './payrolls.service';

describe('PayrollController', () => {
    let controller: PayrollsController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PayrollsController],
            providers: [
                PayrollsService,
                {
                    provide: getRepositoryToken(Payroll),
                    useFactory: repositoryMockFactory,
                },
                { provide: PositionsService, useValue: createMock<PositionsService>() },
                { provide: AccessService, useValue: createMock<AccessService>() },
            ],
        }).compile();

        controller = module.get<PayrollsController>(PayrollsController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
