import { CalcMethod, Resource, WrapperType } from '@/types';
import {
    PaymentGroupsTotal,
    PaymentPartsTotal,
    defaultPaymentGroupsTotal,
    defaultPaymentPartsTotal,
} from '@/types';
import { checkVersionOrFail } from '@/utils';
import { BadRequestException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsWhere, Repository } from 'typeorm';
import { AvailableForUserCompany } from '../abstract/available-for-user-company';
import { AccessService } from '../access/access.service';
import { PositionsService } from '../positions/positions.service';
import { CreatePayrollDto } from './dto/create-payroll.dto';
import { FindPayrollDto } from './dto/find-payroll.dto';
import { UpdatePayrollDto } from './dto/update-payroll.dto';
import { Payroll } from './entities/payroll.entity';

@Injectable()
export class PayrollsService extends AvailableForUserCompany {
    public readonly resource = Resource.Payroll;

    constructor(
        @InjectRepository(Payroll) private repository: Repository<Payroll>,
        @Inject(forwardRef(() => AccessService)) public accessService: WrapperType<AccessService>,
        @Inject(forwardRef(() => PositionsService))
        private positionsService: WrapperType<PositionsService>,
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

    async create(userId: string, payload: CreatePayrollDto): Promise<Payroll> {
        const created = await this.repository.save({
            ...payload,
            createdUserId: userId,
            updatedUserId: userId,
        });
        return await this.repository.findOneOrFail({ where: { id: created.id } });
    }

    async findAll(params: FindPayrollDto): Promise<Payroll[]> {
        const { positionId, companyId, payPeriod, relations } = params;
        if (!positionId && !companyId) {
            throw new BadRequestException('Should be defined companyId or positionId');
        }
        return await this.repository.find({
            relations: {
                position: !!relations || !!companyId,
                paymentType: !!relations,
            },
            where: {
                ...(positionId ? { positionId } : {}),
                ...(payPeriod ? { payPeriod } : {}),
                ...(companyId ? { position: { companyId } } : {}),
            },
        });
    }

    async findBetween(
        positionId: string,
        dateFrom: Date,
        dateTo: Date,
        relations?: boolean,
    ): Promise<Payroll[]> {
        return await this.repository.find({
            where: {
                positionId,
                accPeriod: Between(dateFrom, dateTo),
            },
            relations: {
                position: relations,
                paymentType: relations,
            },
        });
    }

    async findOne(id: string, relations: boolean): Promise<Payroll> {
        const payroll = await this.repository.findOneOrFail({
            where: { id },
            relations: { position: relations, paymentType: relations },
        });
        return payroll;
    }

    async update(userId: string, id: string, payload: UpdatePayrollDto): Promise<Payroll> {
        const record = await this.repository.findOneOrFail({ where: { id } });
        checkVersionOrFail(record, payload);
        await this.repository.save({
            ...payload,
            id,
            updatedUserId: userId,
            updatedDate: new Date(),
        });
        return await this.repository.findOneOrFail({ where: { id } });
    }

    async remove(userId: string, id: string): Promise<Payroll> {
        await this.repository.save({ id, deletedDate: new Date(), deletedUserId: userId });
        return await this.repository.findOneOrFail({ where: { id }, withDeleted: true });
    }

    async delete(id: string) {
        await this.repository.delete(id);
    }

    async deleteBy(params: FindOptionsWhere<Payroll>) {
        await this.repository.delete(params);
    }

    async payrollPositionPaymentParts(
        positionId: string,
        payPeriod: Date,
    ): Promise<PaymentPartsTotal> {
        const records = await this.repository
            .createQueryBuilder('payroll')
            .select('paymentType.paymentPart', 'paymentPart')
            .addSelect('SUM(payroll.factSum)', 'factSum')
            .innerJoin('payroll.paymentType', 'paymentType')
            .where('payroll.positionId = :positionId', { positionId })
            .andWhere('payroll.payPeriod = :payPeriod', { payPeriod })
            .groupBy('paymentType.paymentPart')
            .getRawMany();
        return {
            ...defaultPaymentPartsTotal,
            ...records.reduce((a, b) => {
                a[b.paymentPart] = Number(b.factSum);
                return a;
            }, {}),
        };
    }

    async payrollPositionPaymentGroups(
        positionId: string,
        payPeriod: Date,
    ): Promise<PaymentGroupsTotal> {
        const records = await this.repository
            .createQueryBuilder('payroll')
            .select('paymentType.paymentGroup', 'paymentGroup')
            .addSelect('SUM(payroll.factSum)', 'factSum')
            .innerJoin('payroll.paymentType', 'paymentType')
            .where('payroll.positionId = :positionId', { positionId })
            .andWhere('payroll.payPeriod = :payPeriod', { payPeriod })
            .groupBy('paymentType.paymentGroup')
            .getRawMany();
        return {
            ...defaultPaymentGroupsTotal,
            ...records.reduce((a, b) => {
                a[b.paymentGroup] = Number(b.factSum);
                return a;
            }, {}),
        };
    }

    async payrollCompanyPaymentParts(
        companyId: string,
        payPeriod: Date,
    ): Promise<PaymentPartsTotal> {
        const records = await this.repository
            .createQueryBuilder('payroll')
            .select('paymentType.paymentPart', 'paymentPart')
            .addSelect('SUM(payroll.factSum)', 'factSum')
            .innerJoin('payroll.paymentType', 'paymentType')
            .innerJoin('payroll.position', 'position')
            .where('position.companyId = :companyId', { companyId })
            .andWhere('payroll.positionId = position.id')
            .andWhere('payroll.payPeriod = :payPeriod', { payPeriod })
            .groupBy('paymentType.paymentPart')
            .getRawMany();
        return {
            ...defaultPaymentPartsTotal,
            ...records.reduce((a, b) => {
                a[b.paymentPart] = Number(b.factSum);
                return a;
            }, {}),
        };
    }

    async payrollCompanyPaymentGroups(
        companyId: string,
        payPeriod: Date,
    ): Promise<PaymentGroupsTotal> {
        const records = await this.repository
            .createQueryBuilder('payroll')
            .select('paymentType.paymentGroup', 'paymentGroup')
            .addSelect('SUM(payroll.factSum)', 'factSum')
            .innerJoin('payroll.paymentType', 'paymentType')
            .innerJoin('payroll.position', 'position')
            .where('position.companyId = :companyId', { companyId })
            .andWhere('payroll.positionId = position.id')
            .andWhere('payroll.payPeriod = :payPeriod', { payPeriod })
            .groupBy('paymentType.paymentGroup')
            .getRawMany();
        return {
            ...defaultPaymentGroupsTotal,
            ...records.reduce((a, b) => {
                a[b.paymentGroup] = Number(b.factSum);
                return a;
            }, {}),
        };
    }

    async payrollCompanyCalcMethods(
        companyId: string,
        payPeriod: Date,
    ): Promise<{ calcMethod: CalcMethod; factSum: number }[]> {
        return await this.repository
            .createQueryBuilder('payroll')
            .select('paymentType.calcMethod', 'calcMethod')
            .addSelect('SUM(payroll.factSum)', 'factSum')
            .innerJoin('payroll.paymentType', 'paymentType')
            .innerJoin('payroll.position', 'position')
            .where('position.companyId = :companyId', { companyId })
            .andWhere('payroll.positionId = position.id')
            .andWhere('payroll.payPeriod = :payPeriod', { payPeriod })
            .groupBy('paymentType.calcMethod')
            .getRawMany();
    }

    async payrollCompanyCalcMethodsByPositions(
        companyId: string,
        payPeriod: Date,
    ): Promise<{ positionId: string; calcMethod: string; factSum: number }[]> {
        return await this.repository
            .createQueryBuilder('payroll')
            .select('payroll.positionId', 'positionId')
            .addSelect('paymentType.calcMethod', 'calcMethod')
            .addSelect('SUM(payroll.factSum)', 'factSum')
            .innerJoin('payroll.paymentType', 'paymentType')
            .innerJoin('payroll.position', 'position')
            .where('position.companyId = :companyId', { companyId })
            .andWhere('payroll.positionId = position.id')
            .andWhere('payroll.payPeriod = :payPeriod', { payPeriod })
            .groupBy('payroll.positionId')
            .addGroupBy('paymentType.calcMethod')
            .getRawMany();
    }
}
