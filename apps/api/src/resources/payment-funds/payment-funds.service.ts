import { AccessService, AvailableForUserCompany } from '@/resources';
import { ResourceType } from '@/types';
import { BadRequestException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentPositionsService } from '../payment-positions';
import { PaymentsService } from '../payments';
import { CreatePaymentFundDto, UpdatePaymentFundDto } from './dto';
import { PaymentFund } from './entities/payment-fund.entity';

@Injectable()
export class PaymentFundsService extends AvailableForUserCompany {
    public readonly resourceType = ResourceType.PAYMENT;

    constructor(
        @InjectRepository(PaymentFund)
        private repository: Repository<PaymentFund>,
        @Inject(forwardRef(() => AccessService))
        public accessService: AccessService,
        @Inject(forwardRef(() => PaymentsService))
        public paymentsService: PaymentsService,
        @Inject(forwardRef(() => PaymentPositionsService))
        public paymentPositionsService: PaymentPositionsService,
    ) {
        super(accessService);
    }

    async getCompanyId(entityId: number): Promise<number> {
        const paymentFund = await this.repository.findOneOrFail({ where: { id: entityId } });
        const paymentPosition = await this.paymentPositionsService.findOne(
            paymentFund.paymentPositionId,
        );
        return (await this.paymentsService.findOne(paymentPosition.paymentId)).companyId;
    }

    async create(userId: number, payload: CreatePaymentFundDto): Promise<PaymentFund> {
        const created = await this.repository.save({
            ...payload,
            createdUserId: userId,
            updatedUserId: userId,
        });
        return await this.repository.findOneOrFail({ where: { id: created.id } });
    }

    async findAll(paymentPositionId: number, relations: boolean = false): Promise<PaymentFund[]> {
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

    async findOne(id: number, relations: boolean = false): Promise<PaymentFund> {
        const record = await this.repository.findOneOrFail({
            where: { id },
            relations: { paymentPosition: relations, payFundType: relations },
        });
        return record;
    }

    async update(userId: number, id: number, payload: UpdatePaymentFundDto): Promise<PaymentFund> {
        await this.repository.save({
            ...payload,
            id,
            updatedUserId: userId,
            updatedDate: new Date(),
        });
        return await this.repository.findOneOrFail({ where: { id } });
    }

    async remove(id: number): Promise<void> {
        await this.repository.delete(id);
    }
}
