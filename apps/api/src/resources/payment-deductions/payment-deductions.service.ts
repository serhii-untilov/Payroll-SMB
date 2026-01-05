import { UserAccessService, AvailableForUserCompany } from '@/resources';
import { Resource } from '@/types';
import { BadRequestException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentPositionsService } from './../payment-positions';
import { PaymentsService } from './../payments';
import { CreatePaymentDeductionDto, UpdatePaymentDeductionDto } from './dto';
import { PaymentDeduction } from './entities/payment-deduction.entity';

@Injectable()
export class PaymentDeductionsService extends AvailableForUserCompany {
    public readonly resource = Resource.Payment;

    constructor(
        @InjectRepository(PaymentDeduction)
        private repository: Repository<PaymentDeduction>,
        @Inject(forwardRef(() => UserAccessService))
        public accessService: UserAccessService,
        @Inject(forwardRef(() => PaymentsService))
        public paymentsService: PaymentsService,
        @Inject(forwardRef(() => PaymentPositionsService))
        public paymentPositionsService: PaymentPositionsService,
    ) {
        super(accessService);
    }

    async getCompanyId(entityId: string): Promise<string> {
        const paymentDeduction = await this.repository.findOneOrFail({
            where: { id: entityId },
            withDeleted: true,
        });
        const paymentPosition = await this.paymentPositionsService.findOne(paymentDeduction.paymentPositionId);
        return (await this.paymentsService.findOne(paymentPosition.paymentId)).companyId;
    }

    async create(userId: string, payload: CreatePaymentDeductionDto): Promise<PaymentDeduction> {
        const created = await this.repository.save({
            ...payload,
            createdUserId: userId,
            updatedUserId: userId,
        });
        return await this.repository.findOneOrFail({ where: { id: created.id } });
    }

    async findAll(paymentPositionId: string, relations: boolean = false): Promise<PaymentDeduction[]> {
        if (!paymentPositionId) {
            throw new BadRequestException('Should be defined paymentPositionId');
        }
        return await this.repository.find({
            where: { paymentPositionId },
            relations: {
                paymentPosition: relations,
                paymentType: relations,
            },
        });
    }

    async findOne(id: string, relations: boolean = false): Promise<PaymentDeduction> {
        const record = await this.repository.findOneOrFail({
            where: { id },
            relations: { paymentPosition: relations, paymentType: relations },
        });
        return record;
    }

    async update(userId: string, id: string, payload: UpdatePaymentDeductionDto): Promise<PaymentDeduction> {
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
