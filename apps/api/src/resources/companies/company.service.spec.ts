import { createMock } from '@golevelup/ts-jest';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { maxDate, minDate, monthBegin, monthEnd } from '@repo/shared';
import { MockType, createMockCompany, repositoryMockFactory } from 'test';
import { Repository } from 'typeorm';
import { UserRoleService } from '../user-role/user-role.service';
import { UserService } from '../user/user.service';
import { CompanyService } from './company.service';
import { CompanyEntity } from './entities/company.entity';

describe('CompanyService', () => {
    let service: CompanyService;
    let repoMock: MockType<Repository<CompanyEntity>>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CompanyService,
                { provide: getRepositoryToken(CompanyEntity), useFactory: repositoryMockFactory },
                { provide: UserService, useValue: createMock<UserService>() },
                { provide: UserRoleService, useValue: createMock<UserRoleService>() },
                { provide: EventEmitter2, useValue: createMock<EventEmitter2>() },
            ],
        }).compile();

        service = module.get<CompanyService>(CompanyService);
        repoMock = module.get(getRepositoryToken(CompanyEntity));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(repoMock).toBeTruthy();
    });

    it('should be filled default values for company mock', () => {
        const company = createMockCompany();
        expect(company.dateFrom).toEqual(minDate());
        expect(company.dateTo).toEqual(maxDate());
        expect(company.payPeriod).toEqual(monthBegin(new Date()));
        expect(company.checkDate).toEqual(monthEnd(new Date()));
        expect(company.deletedDate).toBeUndefined();
        expect(company.deletedUserId).toBeUndefined();
    });
});
