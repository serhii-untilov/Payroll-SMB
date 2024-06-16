import {
    BadRequestException,
    ConflictException,
    Inject,
    Injectable,
    forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
    IPaymentGroupsTotal,
    IPaymentPartsTotal,
    ResourceType,
    defaultPaymentGroupsTotal,
    defaultPaymentPartsTotal,
} from '@repo/shared';
import { Between, Repository } from 'typeorm';
import { AvailableForUserCompany } from '../abstract/availableForUserCompany';
import { AccessService } from '../access/access.service';
import { CompaniesService } from '../companies/companies.service';
import { PositionsService } from '../positions/positions.service';
import { CreatePayrollDto } from './dto/create-payroll.dto';
import { FindPayrollDto } from './dto/find-payroll.dto';
import { UpdatePayrollDto } from './dto/update-payroll.dto';
import { Payroll } from './entities/payroll.entity';

@Injectable()
export class PayrollsService extends AvailableForUserCompany {
    public readonly resourceType = ResourceType.PAYROLL;

    constructor(
        @InjectRepository(Payroll)
        private repository: Repository<Payroll>,
        @Inject(forwardRef(() => AccessService))
        public accessService: AccessService,
        @Inject(forwardRef(() => PositionsService))
        private positionsService: PositionsService,
        @Inject(forwardRef(() => CompaniesService))
        private companiesService: CompaniesService,
    ) {
        super(accessService);
    }

    async getCompanyId(entityId: number): Promise<number> {
        const { positionId } = await this.repository.findOneOrFail({
            select: { positionId: true },
            where: { id: entityId },
        });
        return (await this.positionsService.findOne(positionId)).companyId;
    }

    async getPositionCompanyId(positionId: number): Promise<number> {
        return (await this.positionsService.findOne(positionId)).companyId;
    }

    async create(userId: number, payload: CreatePayrollDto): Promise<Payroll> {
        const created = await this.repository.save({
            ...payload,
            createdUserId: userId,
            updatedUserId: userId,
        });
        return await this.repository.findOneOrFail({ where: { id: created.id } });
    }

    async findAll(userId: number, params: FindPayrollDto): Promise<Payroll[]> {
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
                paymentType: relations,
            },
        });
    }

    async findBetween(
        userId: number,
        positionId: number,
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

    async findOne(userId: number, id: number, relations: boolean): Promise<Payroll> {
        const payroll = await this.repository.findOneOrFail({
            where: { id },
            relations: { position: relations, paymentType: relations },
        });
        return payroll;
    }

    async update(userId: number, id: number, payload: UpdatePayrollDto): Promise<Payroll> {
        const record = await this.repository.findOneOrFail({ where: { id } });
        if (payload.version !== record.version) {
            throw new ConflictException(
                'The record has been updated by another user. Try to edit it after reloading.',
            );
        }
        await this.repository.save({ ...payload, id, updatedUserId: userId });
        return await this.repository.findOneOrFail({ where: { id } });
    }

    async remove(userId: number, id: number): Promise<Payroll> {
        await this.repository.save({ id, deletedDate: new Date(), deletedUserId: userId });
        return await this.repository.findOneOrFail({ where: { id }, withDeleted: true });
    }

    async delete(userId: number, id: number) {
        await this.repository.delete(id);
    }

    async payrollPositionPaymentParts(
        positionId: number,
        payPeriod: Date,
    ): Promise<IPaymentPartsTotal> {
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
        positionId: number,
        payPeriod: Date,
    ): Promise<IPaymentGroupsTotal> {
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
        companyId: number,
        payPeriod: Date,
    ): Promise<IPaymentPartsTotal> {
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
        companyId: number,
        payPeriod: Date,
    ): Promise<IPaymentGroupsTotal> {
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
        companyId: number,
        payPeriod: Date,
    ): Promise<{ calcMethod: string; factSum: number }[]> {
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
        companyId: number,
        payPeriod: Date,
    ): Promise<{ positionId: number; calcMethod: string; factSum: number }[]> {
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
