import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockType, repositoryMockFactory } from '@repo/testing';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { Position } from './entities/position.entity';
import { PositionsService } from './positions.service';
import { CompaniesService } from '../companies/companies.service';

describe('PositionsService', () => {
    let service: PositionsService;
    let repoMock: MockType<Repository<Position>>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
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

        service = module.get<PositionsService>(PositionsService);
        repoMock = module.get(getRepositoryToken(Position));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(repoMock).toBeTruthy();
    });
});
