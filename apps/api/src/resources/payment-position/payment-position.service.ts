import { Action, Resource } from '@/types';
import { BadRequestException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseUserAccess } from '../common/base';
import { Payment } from '../payments/entities/payment.entity';
import { PayrollsService } from '../payrolls';
import { UserAccessService } from '../user-access/user-access.service';
import { FindAllPaymentPositionDto, FindOnePaymentPositionDto } from './dto';
import { CreatePaymentPositionDto } from './dto/create-payment-position.dto';
import { UpdatePaymentPositionDto } from './dto/update-payment-position.dto';
import { PaymentPosition } from './entities/paymentPosition.entity';

@Injectable()
export class PaymentPositionService extends BaseUserAccess {
    public readonly resource = Resource.PaymentPosition;

    constructor(
        @InjectRepository(PaymentPosition) private repository: Repository<PaymentPosition>,
        @Inject(forwardRef(() => UserAccessService)) public userAccessService: UserAccessService,
        @Inject(forwardRef(() => PayrollsService)) private payrollsService: PayrollsService,
    ) {
        super(userAccessService, Resource.PaymentPosition);
    }

    // async getCompanyId(entityId: string): Promise<string> {
    //     const paymentPosition = await this.repository.findOneOrFail({
    //         where: { id: entityId },
    //         withDeleted: true,
    //     });
    //     return (await this.repository.findOne(paymentPosition.paymentId, { withDeleted: true }))?.companyId;
    // }

    // async getPaymentCompanyId(paymentId: string): Promise<string> {
    //     return (await this.paymentsService.findOne(paymentId, { withDeleted: true })).companyId;
    // }

    async create(userId: string, payload: CreatePaymentPositionDto): Promise<PaymentPosition> {
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

    async findByPositionId(positionId: string, accPeriod: Date): Promise<PaymentPosition[]> {
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

    async findOne(userId: string, id: string, params?: FindOnePaymentPositionDto): Promise<PaymentPosition> {
        await this.canOrFail(userId, Action.Read, { resourceId: id });
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

    async update(userId: string, id: string, version: number, payload: UpdatePaymentPositionDto): Promise<void> {
        await this.canOrFail(userId, Action.Update, { resourceId: id });
        await this.repository.update({ id, version }, { ...payload, updatedUserId: userId, updatedDate: new Date() });
        await this.repository.findOneOrFail({ where: { id } });
    }

    async remove(userId: string, id: string, version: number): Promise<void> {
        await this.canOrFail(userId, Action.Remove, { resourceId: id });
        await this.repository.update({ id, version }, { deletedDate: new Date(), deletedUserId: userId });
    }

    async delete(ids: string[]) {
        await this.repository.delete(ids);
    }

    async calculateTotals(paymentId: string) {
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

    async process(userId: string, payment: Payment) {
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
                sourceType: Resource.Payment,
                sourceId: payment.id,
                planSum: paymentPosition.baseSum,
                factSum: paymentPosition.paySum,
                recordFlags: paymentPosition.recordFlags,
            });
        }
    }

    async withdraw(paymentId: string) {
        await this.payrollsService.deleteBy({
            sourceType: Resource.Payment,
            sourceId: paymentId,
        });
    }
}
