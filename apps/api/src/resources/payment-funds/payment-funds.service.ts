import { AccessService, AvailableForUserCompany } from '@/resources';
import { Resource } from '@/types';
import { BadRequestException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentPositionsService } from '../payment-positions';
import { PaymentsService } from '../payments';
import { CreatePaymentFundDto, UpdatePaymentFundDto } from './dto';
import { PaymentFund } from './entities/payment-fund.entity';

@Injectable()
export class PaymentFundsService extends AvailableForUserCompany {
    public readonly resource = Resource.Payment;

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

    async getCompanyId(entityId: string): Promise<string> {
        const paymentFund = await this.repository.findOneOrFail({
            where: { id: entityId },
            withDeleted: true,
        });
        const paymentPosition = await this.paymentPositionsService.findOne(
            paymentFund.paymentPositionId,
            { withDeleted: true },
        );
        return (
            await this.paymentsService.findOne(paymentPosition.paymentId, { withDeleted: true })
        ).companyId;
    }

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
