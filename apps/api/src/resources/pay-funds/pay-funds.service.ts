import { BadRequestException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
    PayFundCategoryTotal,
    PayFundGroupTotal,
    Resource,
    defaultPayFundCategoryTotal,
    defaultPayFundGroupsTotal,
} from '@/types';
import { Between, Repository } from 'typeorm';
import { AvailableForUserCompany } from '../common/base/available-for-user-company';
import { AccessService } from '../access/access.service';
import { CompaniesService } from '../companies/companies.service';
import { PositionsService } from '../positions/positions.service';
import { CreatePayFundDto } from './dto/create-pay-fund.dto';
import { FindPayFundDto } from './dto/find-pay-fund.dto';
import { UpdatePayFundDto } from './dto/update-pay-fund.dto';
import { PayFund } from './entities/pay-fund.entity';

@Injectable()
export class PayFundsService extends AvailableForUserCompany {
    public readonly resource = Resource.PayFund;

    constructor(
        @InjectRepository(PayFund)
        private repository: Repository<PayFund>,
        @Inject(forwardRef(() => AccessService))
        public accessService: AccessService,
        @Inject(forwardRef(() => PositionsService))
        private positionsService: PositionsService,
        @Inject(forwardRef(() => CompaniesService))
        private companiesService: CompaniesService,
    ) {
        super(accessService);
    }

    async getCompanyId(entityId: string): Promise<string> {
        const { positionId } = await this.repository.findOneOrFail({
            select: { positionId: true },
            where: { id: entityId },
            withDeleted: true,
        });
        return (await this.positionsService.findOne(positionId, { withDeleted: true })).companyId;
    }

    async getPositionCompanyId(positionId: string): Promise<string> {
        return (await this.positionsService.findOne(positionId, { withDeleted: true })).companyId;
    }

    async create(userId: string, payload: CreatePayFundDto): Promise<PayFund> {
        const created = await this.repository.save({
            ...payload,
            createdUserId: userId,
            updatedUserId: userId,
        });
        return await this.repository.findOneOrFail({ where: { id: created.id } });
    }

    async findAll(params: FindPayFundDto): Promise<PayFund[]> {
        const { positionId, companyId, payPeriod, relations } = params;
        if (!positionId && !companyId) {
            throw new BadRequestException('Should be defined companyId or positionId');
        }
        return await this.repository.find({
            relations: {
                position: relations,
                payFundType: relations,
            },
            where: {
                ...(positionId ? { positionId } : {}),
                ...(payPeriod ? { payPeriod } : {}),
                ...(companyId ? { position: { companyId } } : {}),
            },
        });
    }

    async findBetween(positionId: string, dateFrom: Date, dateTo: Date, relations?: boolean): Promise<PayFund[]> {
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

    async findOne(id: string, relations: boolean): Promise<PayFund> {
        return await this.repository.findOneOrFail({
            where: { id },
            relations: { position: relations, payFundType: relations },
        });
    }

    async update(userId: string, id: string, payload: UpdatePayFundDto): Promise<PayFund> {
        await this.repository.save({
            ...payload,
            id,
            updatedUserId: userId,
            updatedDate: new Date(),
        });
        return await this.repository.findOneOrFail({ where: { id } });
    }

    async remove(userId: string, id: string) {
        await this.repository.save({ id, deletedDate: new Date(), deletedUserId: userId });
        return await this.repository.findOneOrFail({ where: { id }, withDeleted: true });
    }

    async delete(ids: string[]) {
        await this.repository.delete(ids);
    }

    async payFundPositionPayFundCategories(positionId: string, payPeriod: Date): Promise<PayFundCategoryTotal> {
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
            ...defaultPayFundCategoryTotal,
            ...records.reduce((a, b) => {
                a[b.payFundCategory] = Number(b.paySum);
                return a;
            }, {}),
        };
    }

    async payFundPositionPayFundGroups(positionId: string, payPeriod: Date): Promise<PayFundGroupTotal> {
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

    async payFundCompanyPayFundCategories(companyId: string, payPeriod: Date): Promise<PayFundCategoryTotal> {
        const records = await this.repository
            .createQueryBuilder('pay-fund')
            .select('payFundType.payFundCategory', 'payFundCategory')
            .addSelect('SUM(pay-fund.paySum)', 'paySum')
            .innerJoin('pay-fund.payFundType', 'payFundType')
            .innerJoin('pay-fund.position', 'position')
            .where('position.companyId = :companyId', { companyId })
            .andWhere('pay_fund.positionId = position.id')
            .andWhere('pay-fund.payPeriod = :payPeriod', { payPeriod })
            .groupBy('payFundType.payFundPart')
            .getRawMany();
        return {
            ...defaultPayFundCategoryTotal,
            ...records.reduce((a, b) => {
                a[b.payFundPart] = Number(b.factSum);
                return a;
            }, {}),
        };
    }

    async payFundCompanyPayFundGroups(companyId: string, payPeriod: Date): Promise<PayFundGroupTotal> {
        const records = await this.repository
            .createQueryBuilder('pay-fund')
            .select('payFundType.payFundGroup', 'payFundGroup')
            .addSelect('SUM(fund.paySum)', 'paySum')
            .innerJoin('pay-fund.payFundType', 'payFundType')
            .innerJoin('pay-fund.position', 'position')
            .where('position.companyId = :companyId', { companyId })
            .andWhere('pay_fund.positionId = position.id')
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
        companyId: string,
        payPeriod: Date,
    ): Promise<{ calcMethod: string; factSum: number }[]> {
        return await this.repository
            .createQueryBuilder('pay-fund')
            .select('payFundType.calcMethod', 'calcMethod')
            .addSelect('SUM(pay-fund.paySum)', 'paySum')
            .innerJoin('pay-fund.payFundType', 'payFundType')
            .innerJoin('pay-fund.position', 'position')
            .where('position.companyId = :companyId', { companyId })
            .andWhere('pay_fund.positionId = position.id')
            .andWhere('pay-fund.payPeriod = :payPeriod', { payPeriod })
            .groupBy('payFundType.calcMethod')
            .getRawMany();
    }

    async fundCompanyCalcMethodsByPositions(
        companyId: string,
        payPeriod: Date,
    ): Promise<{ positionId: string; calcMethod: string; factSum: number }[]> {
        return await this.repository
            .createQueryBuilder('pay-fund')
            .select('pay-fund.positionId', 'positionId')
            .addSelect('payFundType.calcMethod', 'calcMethod')
            .addSelect('SUM(pay-fund.paySum)', 'paySum')
            .innerJoin('pay-fund.payFundType', 'payFundType')
            .innerJoin('pay-fund.position', 'position')
            .where('position.companyId = :companyId', { companyId })
            .andWhere('pay_fund.positionId = position.id')
            .andWhere('pay-fund.payPeriod = :payPeriod', { payPeriod })
            .groupBy('pay-fund.positionId')
            .addGroupBy('payFundType.calcMethod')
            .getRawMany();
    }

    async paySum(companyId: string, payPeriod: Date): Promise<number> {
        const { paySum } = await this.repository
            .createQueryBuilder('pay_fund')
            .select('SUM("paySum")', 'paySum')
            .innerJoin('position', 'position')
            .where('position.companyId = :companyId', { companyId })
            .andWhere('pay_fund.positionId = position.id')
            .andWhere('pay_fund.payPeriod = :payPeriod', { payPeriod })
            .getRawOne();
        return Number(paySum);
    }
}
