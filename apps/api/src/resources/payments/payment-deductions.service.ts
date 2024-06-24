import { BadRequestException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResourceType } from '@repo/shared';
import { Repository } from 'typeorm';
import { AvailableForUserCompany } from '../abstract/availableForUserCompany';
import { AccessService } from '../access/access.service';
import { CreatePaymentDeductionDto } from './dto/create-paymentDeduction.dto';
import { UpdatePaymentDeductionDto } from './dto/update-paymentDeduction.dto';
import { PaymentDeduction } from './entities/paymentDeduction.entity';
import { PaymentPositionsService } from './payment-positions.service';
import { PaymentsService } from './payments.service';

@Injectable()
export class PaymentDeductionsService extends AvailableForUserCompany {
    public readonly resourceType = ResourceType.PAYMENT;

    constructor(
        @InjectRepository(PaymentDeduction)
        private repository: Repository<PaymentDeduction>,
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
        const paymentDeduction = await this.repository.findOneOrFail({ where: { id: entityId } });
        const paymentPosition = await this.paymentPositionsService.findOne(
            paymentDeduction.paymentPositionId,
        );
        return (await this.paymentsService.findOne(paymentPosition.paymentId)).companyId;
    }

    async create(userId: number, payload: CreatePaymentDeductionDto): Promise<PaymentDeduction> {
        const created = await this.repository.save({
            ...payload,
            createdUserId: userId,
            updatedUserId: userId,
        });
        return await this.repository.findOneOrFail({ where: { id: created.id } });
    }

    async findAll(
        paymentPositionId: number,
        relations: boolean = false,
    ): Promise<PaymentDeduction[]> {
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

    async findOne(id: number, relations: boolean = false): Promise<PaymentDeduction> {
        const record = await this.repository.findOneOrFail({
            where: { id },
            relations: { paymentPosition: relations, paymentType: relations },
        });
        return record;
    }

    async update(
        userId: number,
        id: number,
        payload: UpdatePaymentDeductionDto,
    ): Promise<PaymentDeduction> {
        await this.repository.save({
            ...payload,
            id,
            updatedUserId: userId,
            updatedDate: new Date(),
        });
        return await this.repository.findOneOrFail({ where: { id } });
    }

    async remove(userId: number, id: number): Promise<void> {
        await this.repository.delete(id);
    }
}
