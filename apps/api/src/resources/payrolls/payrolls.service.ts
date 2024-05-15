import { BadRequestException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessType, ResourceType } from '@repo/shared';
import { Repository } from 'typeorm';
import { AccessService } from '../access/access.service';
import { CompaniesService } from '../companies/companies.service';
import { PositionsService } from '../positions/positions.service';
import { CreatePayrollDto } from './dto/create-payroll.dto';
import { FindPayrollDto } from './dto/find-payroll.dto';
import { UpdatePayrollDto } from './dto/update-payroll.dto';
import { Payroll } from './entities/payroll.entity';

@Injectable()
export class PayrollsService {
    public readonly resourceType = ResourceType.PAYROLL;

    constructor(
        @InjectRepository(Payroll)
        private repository: Repository<Payroll>,
        @Inject(forwardRef(() => PositionsService))
        private positionsService: PositionsService,
        @Inject(forwardRef(() => AccessService))
        private accessService: AccessService,
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
        if (payload.payPeriod !== company.payPeriod) {
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
        if (payroll.payPeriod !== company.payPeriod) {
            await this.accessService.availableForUserCompanyOrFail(
                userId,
                position.companyId,
                this.resourceType,
                AccessType.ELEVATED,
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
        if (payroll.payPeriod !== company.payPeriod) {
            await this.accessService.availableForUserCompanyOrFail(
                userId,
                position.companyId,
                this.resourceType,
                AccessType.ELEVATED,
            );
        }
        return await this.repository.save({ id, deletedDate: new Date(), deletedUserId: userId });
    }

    async calculateCompany(userId: number, companyId: number): Promise<Payroll[]> {
        await this.accessService.availableForUserCompanyOrFail(
            userId,
            companyId,
            this.resourceType,
            AccessType.CREATE,
        );
        return [];
    }
}
