import { Test, TestingModule } from '@nestjs/testing';
import { PositionsController } from './positions.controller';
import { PositionsService } from './positions.service';
import { UsersService } from '../users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Position } from './entities/position.entity';
import { repositoryMockFactory } from '@repo/testing';
import { createMock } from '@golevelup/ts-jest';
import { CompaniesService } from '../companies/companies.service';

describe('PositionsController', () => {
    let controller: PositionsController;
    let service: PositionsService;
    let usersService: UsersService;
    let companiesService: CompaniesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PositionsController],
            providers: [
                PositionsService,
                {
                    provide: getRepositoryToken(Position),
                    useFactory: repositoryMockFactory,
                },
                { provide: UsersService, useValue: createMock<UsersService>() },
                { provide: CompaniesService, useValue: createMock<CompaniesService>() },
            ],
        }).compile();

        controller = module.get<PositionsController>(PositionsController);
        service = module.get<PositionsService>(PositionsService);
        usersService = module.get<UsersService>(UsersService);
        companiesService = module.get<CompaniesService>(CompaniesService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(service).toBeDefined();
        expect(usersService).toBeDefined();
        expect(companiesService).toBeDefined();
    });
});
