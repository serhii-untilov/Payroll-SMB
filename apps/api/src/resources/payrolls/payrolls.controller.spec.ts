import { Test, TestingModule } from '@nestjs/testing';
import { PayrollsController } from './payrolls.controller';
import { PayrollsService } from './payrolls.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Payroll } from './entities/payroll.entity';
import { repositoryMockFactory } from '@repo/testing';
import { PositionsService } from '../positions/positions.service';
import { CompaniesService } from '../companies/companies.service';
import { AccessService } from '../access/access.service';
import { createMock } from '@golevelup/ts-jest';

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
                { provide: CompaniesService, useValue: createMock<CompaniesService>() },
                { provide: AccessService, useValue: createMock<AccessService>() },
            ],
        }).compile();

        controller = module.get<PayrollsController>(PayrollsController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
