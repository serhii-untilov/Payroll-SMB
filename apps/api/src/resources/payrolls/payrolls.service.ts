import {
    BadRequestException,
    ConflictException,
    Inject,
    Injectable,
    forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessType, IPaymentGroupsTotal, IPaymentPartsTotal, ResourceType } from '@repo/shared';
import { Between, Repository } from 'typeorm';
import { AccessService } from '../access/access.service';
import { CompaniesService } from '../companies/companies.service';
import { PositionsService } from '../positions/positions.service';
import { CreatePayrollDto } from './dto/create-payroll.dto';
import { FindPayrollDto } from './dto/find-payroll.dto';
import { UpdatePayrollDto } from './dto/update-payroll.dto';
import { Payroll } from './entities/payroll.entity';
import { defaultPaymentPartsTotal, defaultPaymentGroupsTotal } from '@repo/shared';

@Injectable()
export class PayrollsService {
    public readonly resourceType = ResourceType.PAYROLL;

    constructor(
        @InjectRepository(Payroll)
        private repository: Repository<Payroll>,
        @Inject(forwardRef(() => AccessService))
        private accessService: AccessService,
        @Inject(forwardRef(() => PositionsService))
        private positionsService: PositionsService,
        @Inject(forwardRef(() => CompaniesService))
        private companiesService: CompaniesService,
    ) {}

    async create(userId: number, payload: CreatePayrollDto): Promise<Payroll> {
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
        return await this.repository.save({
            ...payload,
            createdUserId: userId,
            updatedUserId: userId,
        });
    }

    async findAll(userId: number, params: FindPayrollDto): Promise<Payroll[]> {
        const { positionId, companyId, relations, ...other } = params;
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
        const position = await this.positionsService.findOne(userId, positionId);
        await this.accessService.availableForUserCompanyOrFail(
            userId,
            position.companyId,
            this.resourceType,
            AccessType.ACCESS,
        );
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
        const position = await this.positionsService.findOne(userId, payroll.positionId);
        await this.accessService.availableForUserCompanyOrFail(
            userId,
            position.companyId,
            this.resourceType,
            AccessType.ACCESS,
        );
        return payroll;
    }

    async update(userId: number, id: number, payload: UpdatePayrollDto): Promise<Payroll> {
        const payroll = await this.repository.findOneOrFail({ where: { id } });
        const position = await this.positionsService.findOne(userId, payroll.positionId);
        await this.accessService.availableForUserCompanyOrFail(
            userId,
            position.companyId,
            this.resourceType,
            AccessType.ACCESS,
        );
        const company = await this.companiesService.findOne(userId, position.companyId);
        if (payroll.payPeriod.getTime() !== company.payPeriod.getTime()) {
            await this.accessService.availableForUserCompanyOrFail(
                userId,
                position.companyId,
                this.resourceType,
                AccessType.ELEVATED,
            );
        }
        if (payload.version !== payroll.version) {
            throw new ConflictException(
                'The record has been updated by another user. Try to edit it after reloading.',
            );
        }
        return await this.repository.save({ ...payload, id, updatedUserId: userId });
    }

    async remove(userId: number, id: number) {
        const payroll = await this.repository.findOneOrFail({ where: { id } });
        const position = await this.positionsService.findOne(userId, payroll.positionId);
        await this.accessService.availableForUserCompanyOrFail(
            userId,
            position.companyId,
            this.resourceType,
            AccessType.ACCESS,
        );
        const company = await this.companiesService.findOne(userId, position.companyId);
        if (payroll.payPeriod.getTime() !== company.payPeriod.getTime()) {
            await this.accessService.availableForUserCompanyOrFail(
                userId,
                position.companyId,
                this.resourceType,
                AccessType.ELEVATED,
            );
        }
        return await this.repository.save({ id, deletedDate: new Date(), deletedUserId: userId });
    }

    async delete(userId: number, id: number) {
        const payroll = await this.repository.findOneOrFail({ where: { id } });
        const position = await this.positionsService.findOne(userId, payroll.positionId);
        await this.accessService.availableForUserCompanyOrFail(
            userId,
            position.companyId,
            this.resourceType,
            AccessType.ACCESS,
        );
        const company = await this.companiesService.findOne(userId, position.companyId);
        if (payroll.payPeriod.getTime() !== company.payPeriod.getTime()) {
            await this.accessService.availableForUserCompanyOrFail(
                userId,
                position.companyId,
                this.resourceType,
                AccessType.ELEVATED,
            );
        }
        return await this.repository.delete(id);
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
            .andWhere('payroll.payPeriod = :payPeriod', { payPeriod })
            .groupBy('paymentType.calcMethod')
            .getRawMany();
    }
}
