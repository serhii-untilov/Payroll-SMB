import { Resource } from '@/types';
import { BadRequestException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseUserAccess } from '../common/base/user-access.abstract';
import { UserAccessService } from '../user-access/user-access.service';
import { PaymentPositionService } from '../payment-position/payment-position.service';
import { PaymentsService } from '../payments/payments.service';
import { CreatePaymentFundDto } from './dto/create-payment-fund.dto';
import { UpdatePaymentFundDto } from './dto/update-payment-fund.dto';
import { PaymentFund } from './entities/payment-fund.entity';

@Injectable()
export class PaymentFundsService extends BaseUserAccess {
    constructor(
        @InjectRepository(PaymentFund) private repository: Repository<PaymentFund>,
        @Inject(forwardRef(() => UserAccessService)) public userAccessService: UserAccessService,
        @Inject(forwardRef(() => PaymentsService)) public paymentsService: PaymentsService,
        @Inject(forwardRef(() => PaymentPositionService)) public paymentPositionsService: PaymentPositionService,
    ) {
        super(userAccessService, Resource.Payment);
    }

    // async getCompanyId(entityId: string): Promise<string> {
    //     const paymentFund = await this.repository.findOneOrFail({
    //         where: { id: entityId },
    //         withDeleted: true,
    //     });
    //     const paymentPosition = await this.paymentPositionsService.findOne(paymentFund.paymentPositionId, {
    //         withDeleted: true,
    //     });
    //     return (await this.paymentsService.findOne(paymentPosition.paymentId, { withDeleted: true })).companyId;
    // }

    async create(userId: string, payload: CreatePaymentFundDto): Promise<PaymentFund> {
        const created = await this.repository.save({
            ...payload,
            createdUserId: userId,
            updatedUserId: userId,
        });
        return await this.repository.findOneOrFail({ where: { id: created.id } });
    }

    async findAll(paymentPositionId: string, relations: boolean = false): Promise<PaymentFund[]> {
        if (!paymentPositionId) {
            throw new BadRequestException('Should be defined paymentPositionId');
        }
        return await this.repository.find({
            where: { paymentPositionId },
            relations: {
                paymentPosition: relations,
                payFundType: relations,
            },
        });
    }

    async findOne(id: string, relations: boolean = false): Promise<PaymentFund> {
        const record = await this.repository.findOneOrFail({
            where: { id },
            relations: { paymentPosition: relations, payFundType: relations },
        });
        return record;
    }

    async update(userId: string, id: string, payload: UpdatePaymentFundDto): Promise<PaymentFund> {
        await this.repository.save({
            ...payload,
            id,
            updatedUserId: userId,
            updatedDate: new Date(),
        });
        return await this.repository.findOneOrFail({ where: { id } });
    }

    async remove(id: string): Promise<void> {
        await this.repository.delete(id);
    }
}
