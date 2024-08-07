import { AccessService, AvailableForUserCompany, PayrollsService } from '@/resources';
import { ResourceType, WrapperType } from '@/types';
import { checkVersionOrFail } from '@/utils';
import { BadRequestException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from '../payments/entities/payment.entity';
import { PaymentsService } from '../payments/payments.service';
import {
    CreatePaymentPositionDto,
    FindAllPaymentPositionDto,
    FindOnePaymentPositionDto,
    UpdatePaymentPositionDto,
} from './dto';
import { PaymentPosition } from './entities/paymentPosition.entity';

@Injectable()
export class PaymentPositionsService extends AvailableForUserCompany {
    public readonly resourceType = ResourceType.PaymentPosition;

    constructor(
        @InjectRepository(PaymentPosition)
        private repository: Repository<PaymentPosition>,
        @Inject(forwardRef(() => AccessService))
        public accessService: WrapperType<AccessService>,
        @Inject(forwardRef(() => PaymentsService))
        public paymentsService: WrapperType<PaymentsService>,
        @Inject(forwardRef(() => PayrollsService))
        public payrollsService: WrapperType<PayrollsService>,
    ) {
        super(accessService);
    }

    async getCompanyId(entityId: number): Promise<number> {
        const paymentPosition = await this.repository.findOneOrFail({
            where: { id: entityId },
            withDeleted: true,
        });
        return (
            await this.paymentsService.findOne(paymentPosition.paymentId, { withDeleted: true })
        ).companyId;
    }

    async getPaymentCompanyId(paymentId: number): Promise<number> {
        return (await this.paymentsService.findOne(paymentId, { withDeleted: true })).companyId;
    }

    async create(userId: number, payload: CreatePaymentPositionDto): Promise<PaymentPosition> {
        const created = await this.repository.save({
            ...payload,
            createdUserId: userId,
            updatedUserId: userId,
        });
        return await this.repository.findOneOrFail({ where: { id: created.id } });
    }

    async findAll(params: FindAllPaymentPositionDto): Promise<PaymentPosition[]> {
        const { paymentId, relations } = params;
        if (!paymentId) {
            throw new BadRequestException('Should be defined paymentId');
        }
        return await this.repository.find({
            where: { paymentId },
            relations: {
                payment: relations,
                position: relations
                    ? {
                          person: true,
                          history: true,
                      }
                    : false,
            },
        });
    }

    async findByPositionId(positionId: number, accPeriod: Date): Promise<PaymentPosition[]> {
        return await this.repository.find({
            relations: {
                payment: true,
                position: {
                    person: true,
                    history: true,
                },
            },
            where: { positionId, payment: { accPeriod } },
        });
    }

    async findOne(id: number, params?: FindOnePaymentPositionDto): Promise<PaymentPosition> {
        const record = await this.repository.findOneOrFail({
            withDeleted: !!params?.withDeleted,
            where: { id },
            relations: {
                payment: !!params?.relations,
                position: !!params?.relations
                    ? {
                          person: true,
                          history: true,
                      }
                    : false,
            },
        });
        return record;
    }

    async update(userId: number, id: number, payload: UpdatePaymentPositionDto) {
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

    async remove(userId: number, id: number): Promise<PaymentPosition> {
        await this.repository.save({ id, deletedDate: new Date(), deletedUserId: userId });
        return await this.repository.findOneOrFail({ where: { id }, withDeleted: true });
    }

    async delete(ids: number[]) {
        await this.repository.delete(ids);
    }

    async calculateTotals(paymentId: number) {
        const totals = await this.repository
            .createQueryBuilder('payment_position')
            .select('SUM("baseSum")', 'baseSum')
            .addSelect('SUM(deductions)', 'deductions')
            .addSelect('SUM("paySum")', 'paySum')
            .addSelect('SUM(funds)', 'funds')
            .where('"paymentId" = :paymentId', { paymentId })
            .getRawOne();
        return {
            baseSum: totals.baseSum || 0,
            deductions: totals.deductions || 0,
            paySum: totals.paySum || 0,
            funds: totals.funds || 0,
        };
    }

    async process(userId: number, payment: Payment) {
        const paymentPositions = await this.findAll({ paymentId: payment.id, relations: true });
        for (const paymentPosition of paymentPositions) {
            if (!payment?.company?.payPeriod) {
                throw new Error('Undefined Pay Period.');
            }
            await this.payrollsService.create(userId, {
                positionId: paymentPosition.positionId,
                payPeriod: payment.company.payPeriod,
                accPeriod: payment.accPeriod,
                paymentTypeId: payment.paymentTypeId,
                dateFrom: payment.dateFrom,
                dateTo: payment.dateTo,
                sourceType: ResourceType.Payment,
                sourceId: payment.id,
                planSum: paymentPosition.baseSum,
                factSum: paymentPosition.paySum,
                recordFlags: paymentPosition.recordFlags,
            });
        }
    }

    async withdraw(paymentId: number) {
        await this.payrollsService.deleteBy({
            sourceType: ResourceType.Payment,
            sourceId: paymentId,
        });
    }
}
