import { BadRequestException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
    AccessType,
    IPayFundGroupsTotal,
    IPayFundCategoriesTotal,
    ResourceType,
} from '@repo/shared';
import { Between, Repository } from 'typeorm';
import { AccessService } from '../access/access.service';
import { CompaniesService } from '../companies/companies.service';
import { PositionsService } from '../positions/positions.service';
import { CreatePayFundDto } from './dto/create-pay-fund.dto';
import { FindPayFundDto } from './dto/find-pay-fund.dto';
import { UpdatePayFundDto } from './dto/update-pay-fund.dto';
import { PayFund } from './entities/pay-fund.entity';
import { defaultPayFundCategoriesTotal, defaultPayFundGroupsTotal } from '@repo/shared';

@Injectable()
export class PayFundsService {
    public readonly resourceType = ResourceType.PAY_FUND;

    constructor(
        @InjectRepository(PayFund)
        private repository: Repository<PayFund>,
        @Inject(forwardRef(() => AccessService))
        private accessService: AccessService,
        @Inject(forwardRef(() => PositionsService))
        private positionsService: PositionsService,
        @Inject(forwardRef(() => CompaniesService))
        private companiesService: CompaniesService,
    ) {}

    async availableFindAllOrFail(userId: number, params: FindPayFundDto) {
        const { positionId, companyId } = params;
        if (!positionId && !companyId) {
            throw new BadRequestException('Should be defined companyId or positionId');
        }
        if (positionId) {
            const position = await this.positionsService.findOne(userId, params.positionId);
            await this.accessService.availableForUserCompanyOrFail(
                userId,
                position.companyId,
                this.resourceType,
                AccessType.ACCESS,
            );
        }
        if (companyId) {
            await this.accessService.availableForUserCompanyOrFail(
                userId,
                companyId,
                this.resourceType,
                AccessType.ACCESS,
            );
        }
    }

    async availableFindOneOrFail(userId: number, positionId: number) {
        const position = await this.positionsService.findOne(userId, positionId);
        await this.accessService.availableForUserCompanyOrFail(
            userId,
            position.companyId,
            this.resourceType,
            AccessType.ACCESS,
        );
    }

    async availableCreateOrFail(userId: number, payload: CreatePayFundDto) {
        const position = await this.positionsService.findOne(userId, payload.positionId);
        await this.accessService.availableForUserCompanyOrFail(
            userId,
            position.companyId,
            this.resourceType,
            AccessType.CREATE,
        );
        const company = await this.companiesService.findOne(userId, position.companyId);
        if (payload.payPeriod.getTime() !== company.payPeriod.getTime()) {
            await this.accessService.availableForUserCompanyOrFail(
                userId,
                position.companyId,
                this.resourceType,
                AccessType.ELEVATED,
            );
        }
    }

    async availableUpdateOrFail(userId: number, id: number) {
        const record = await this.repository.findOneOrFail({ where: { id } });
        const position = await this.positionsService.findOne(userId, record.positionId);
        await this.accessService.availableForUserCompanyOrFail(
            userId,
            position.companyId,
            this.resourceType,
            AccessType.UPDATE,
        );
        const company = await this.companiesService.findOne(userId, position.companyId);
        if (record.payPeriod.getTime() !== company.payPeriod.getTime()) {
            await this.accessService.availableForUserCompanyOrFail(
                userId,
                position.companyId,
                this.resourceType,
                AccessType.ELEVATED,
            );
        }
    }

    async availableDeleteOrFail(userId: number, id: number) {
        const record = await this.repository.findOneOrFail({ where: { id } });
        const position = await this.positionsService.findOne(userId, record.positionId);
        await this.accessService.availableForUserCompanyOrFail(
            userId,
            position.companyId,
            this.resourceType,
            AccessType.DELETE,
        );
        const company = await this.companiesService.findOne(userId, position.companyId);
        if (record.payPeriod.getTime() !== company.payPeriod.getTime()) {
            await this.accessService.availableForUserCompanyOrFail(
                userId,
                position.companyId,
                this.resourceType,
                AccessType.ELEVATED,
            );
        }
    }

    async create(userId: number, payload: CreatePayFundDto): Promise<PayFund> {
        const created = await this.repository.save({
            ...payload,
            createdUserId: userId,
            updatedUserId: userId,
        });
        return await this.repository.findOneOrFail({ where: { id: created.id } });
    }

    async findAll(userId: number, params: FindPayFundDto): Promise<PayFund[]> {
        const { positionId, companyId, relations, ...other } = params;
        if (!positionId && !companyId) {
            throw new BadRequestException('Should be defined companyId or positionId');
        }
        return await this.repository.find({
            where: {
                ...other,
                ...(positionId ? { positionId } : {}),
                ...(companyId ? { position: { companyId } } : {}),
            },
            relations: {
                position: relations,
                payFundType: relations,
            },
        });
    }

    async findBetween(
        positionId: number,
        dateFrom: Date,
        dateTo: Date,
        relations?: boolean,
    ): Promise<PayFund[]> {
        return await this.repository.find({
            where: {
                positionId,
                accPeriod: Between(dateFrom, dateTo),
            },
            relations: {
                position: relations,
                payFundType: relations,
            },
        });
    }

    async findOne(userId: number, id: number, relations: boolean): Promise<PayFund> {
        return await this.repository.findOneOrFail({
            where: { id },
            relations: { position: relations, payFundType: relations },
        });
    }

    async update(userId: number, id: number, payload: UpdatePayFundDto): Promise<PayFund> {
        await this.repository.save({ ...payload, id, updatedUserId: userId });
        return await this.repository.findOneOrFail({ where: { id } });
    }

    async remove(userId: number, id: number) {
        await this.repository.save({ id, deletedDate: new Date(), deletedUserId: userId });
        return await this.repository.findOneOrFail({ where: { id } });
    }

    async delete(userId: number, id: number) {
        await this.repository.delete(id);
    }

    async payFundPositionPayFundCategories(
        positionId: number,
        payPeriod: Date,
    ): Promise<IPayFundCategoriesTotal> {
        const records = await this.repository
            .createQueryBuilder('pay-fund')
            .select('pay-fund-type.payFundCategory', 'payFundCategory')
            .addSelect('SUM(pay-fund.paySum)', 'paySum')
            .innerJoin('pay-fund.payFundType', 'payFundType')
            .where('pay-fund.positionId = :positionId', { positionId })
            .andWhere('pay-fund.payPeriod = :payPeriod', { payPeriod })
            .groupBy('payFundType.payFundCategory')
            .getRawMany();
        return {
            ...defaultPayFundCategoriesTotal,
            ...records.reduce((a, b) => {
                a[b.payFundCategory] = Number(b.paySum);
                return a;
            }, {}),
        };
    }

    async payFundPositionPayFundGroups(
        positionId: number,
        payPeriod: Date,
    ): Promise<IPayFundGroupsTotal> {
        const records = await this.repository
            .createQueryBuilder('pay-fund')
            .select('payFundType.payFundGroup', 'payFundGroup')
            .addSelect('SUM(pay-fund.paySum)', 'paySum')
            .innerJoin('pay-fund.payFundType', 'payFundType')
            .where('pay-fund.positionId = :positionId', { positionId })
            .andWhere('pay-fund.payPeriod = :payPeriod', { payPeriod })
            .groupBy('payFundType.payFundGroup')
            .getRawMany();
        return {
            ...defaultPayFundGroupsTotal,
            ...records.reduce((a, b) => {
                a[b.payFundGroup] = Number(b.paySum);
                return a;
            }, {}),
        };
    }

    async payFundCompanyPayFundCategories(
        companyId: number,
        payPeriod: Date,
    ): Promise<IPayFundCategoriesTotal> {
        const records = await this.repository
            .createQueryBuilder('pay-fund')
            .select('payFundType.payFundCategory', 'payFundCategory')
            .addSelect('SUM(pay-fund.paySum)', 'paySum')
            .innerJoin('pay-fund.payFundType', 'payFundType')
            .innerJoin('pay-fund.position', 'position')
            .where('position.companyId = :companyId', { companyId })
            .andWhere('pay-fund.payPeriod = :payPeriod', { payPeriod })
            .groupBy('payFundType.payFundPart')
            .getRawMany();
        return {
            ...defaultPayFundCategoriesTotal,
            ...records.reduce((a, b) => {
                a[b.payFundPart] = Number(b.factSum);
                return a;
            }, {}),
        };
    }

    async payFundCompanyPayFundGroups(
        companyId: number,
        payPeriod: Date,
    ): Promise<IPayFundGroupsTotal> {
        const records = await this.repository
            .createQueryBuilder('pay-fund')
            .select('payFundType.payFundGroup', 'payFundGroup')
            .addSelect('SUM(fund.paySum)', 'paySum')
            .innerJoin('pay-fund.payFundType', 'payFundType')
            .innerJoin('pay-fund.position', 'position')
            .where('position.companyId = :companyId', { companyId })
            .andWhere('pay-fund.payPeriod = :payPeriod', { payPeriod })
            .groupBy('payFundType.payFundGroup')
            .getRawMany();
        return {
            ...defaultPayFundGroupsTotal,
            ...records.reduce((a, b) => {
                a[b.payFundGroup] = Number(b.factSum);
                return a;
            }, {}),
        };
    }

    async payFundCompanyCalcMethods(
        companyId: number,
        payPeriod: Date,
    ): Promise<{ calcMethod: string; factSum: number }[]> {
        return await this.repository
            .createQueryBuilder('pay-fund')
            .select('payFundType.calcMethod', 'calcMethod')
            .addSelect('SUM(pay-fund.paySum)', 'paySum')
            .innerJoin('pay-fund.payFundType', 'payFundType')
            .innerJoin('pay-fund.position', 'position')
            .where('position.companyId = :companyId', { companyId })
            .andWhere('pay-fund.payPeriod = :payPeriod', { payPeriod })
            .groupBy('payFundType.calcMethod')
            .getRawMany();
    }

    async fundCompanyCalcMethodsByPositions(
        companyId: number,
        payPeriod: Date,
    ): Promise<{ positionId: number; calcMethod: string; factSum: number }[]> {
        return await this.repository
            .createQueryBuilder('pay-fund')
            .select('pay-fund.positionId', 'positionId')
            .addSelect('payFundType.calcMethod', 'calcMethod')
            .addSelect('SUM(pay-fund.paySum)', 'paySum')
            .innerJoin('pay-fund.payFundType', 'payFundType')
            .innerJoin('pay-fund.position', 'position')
            .where('position.companyId = :companyId', { companyId })
            .andWhere('pay-fund.payPeriod = :payPeriod', { payPeriod })
            .groupBy('pay-fund.positionId')
            .addGroupBy('payFundType.calcMethod')
            .getRawMany();
    }
}
