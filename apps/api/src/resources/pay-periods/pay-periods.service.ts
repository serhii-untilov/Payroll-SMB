import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { formatPeriod } from '@repo/utils';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { Company } from '../companies/entities/company.entity';
import { User } from '../users/entities/user.entity';
import { CreatePayPeriodDto } from './dto/create-pay-period.dto';
import { UpdatePayPeriodDto } from './dto/update-pay-period.dto';
import { PayPeriod } from './entities/pay-period.entity';

@Injectable()
export class PayPeriodsService {
    constructor(
        @InjectRepository(PayPeriod)
        private PayPeriodsRepository: Repository<PayPeriod>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Company)
        private companyRepository: Repository<Company>,
    ) {}

    async create(userId: number, payPeriod: CreatePayPeriodDto): Promise<PayPeriod> {
        const existing = await this.PayPeriodsRepository.findOneBy({
            companyId: payPeriod.companyId,
            dateFrom: payPeriod.dateFrom,
            dateTo: payPeriod.dateTo,
        });
        if (existing) {
            throw new BadRequestException(
                `Pay period '${formatPeriod(payPeriod.dateFrom, payPeriod.dateTo)}' already exists.`,
            );
        }
        const intersection = await this.PayPeriodsRepository.findOneBy({
            companyId: payPeriod.companyId,
            dateFrom: LessThanOrEqual(payPeriod.dateTo),
            dateTo: MoreThanOrEqual(payPeriod.dateFrom),
        });
        if (intersection) {
            throw new BadRequestException(
                `Pay period '${formatPeriod(payPeriod.dateFrom, payPeriod.dateTo)}' intersected with period '${formatPeriod(intersection.dateFrom, intersection.dateTo)}' `,
            );
        }
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user) {
            throw new BadRequestException(`User '${userId}' not found.`);
        }
        const company = await this.companyRepository.findOneBy({ id: payPeriod.companyId });
        if (!company) {
            throw new BadRequestException(`Company '${payPeriod.companyId}' not found.`);
        }
        const newPayPeriod = await this.PayPeriodsRepository.save({
            ...payPeriod,
            createdUserId: userId,
            updatedUserId: userId,
        });
        return newPayPeriod;
    }

    async findAll(params): Promise<PayPeriod[]> {
        return await this.PayPeriodsRepository.find(params);
    }

    async findOne(params): Promise<PayPeriod> {
        const PayPeriod = await this.PayPeriodsRepository.findOne(params);
        if (!PayPeriod) {
            throw new NotFoundException(`PayPeriod could not be found.`);
        }
        return PayPeriod;
    }

    async update(userId: number, id: number, data: UpdatePayPeriodDto): Promise<PayPeriod> {
        const PayPeriod = await this.PayPeriodsRepository.findOneBy({ id });
        if (!PayPeriod) {
            throw new NotFoundException(`PayPeriod could not be found.`);
        }
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user) {
            throw new BadRequestException(`User '${userId}' not found.`);
        }
        const company = await this.companyRepository.findOneBy({ id: PayPeriod.companyId });
        if (!company) {
            throw new BadRequestException(`Company '${PayPeriod.companyId}' not found.`);
        }
        await this.PayPeriodsRepository.save({
            ...data,
            id,
            updatedUserId: userId,
        });
        const updated = await this.PayPeriodsRepository.findOneOrFail({ where: { id } });
        return updated;
    }

    async remove(userId: number, id: number): Promise<PayPeriod> {
        const PayPeriod = await this.PayPeriodsRepository.findOneBy({ id });
        if (!PayPeriod) {
            throw new NotFoundException(`PayPeriod could not be found.`);
        }
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user) {
            throw new BadRequestException(`User '${userId}' not found.`);
        }
        await this.PayPeriodsRepository.save({
            ...PayPeriod,
            deletedDate: new Date(),
            deletedUserId: userId,
        });
        return PayPeriod;
    }
}
