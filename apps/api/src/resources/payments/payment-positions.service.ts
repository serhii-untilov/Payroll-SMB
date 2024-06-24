import {
    BadRequestException,
    ConflictException,
    Inject,
    Injectable,
    forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResourceType } from '@repo/shared';
import { Repository } from 'typeorm';
import { AvailableForUserCompany } from '../abstract/availableForUserCompany';
import { AccessService } from '../access/access.service';
import { CreatePaymentPositionDto } from './dto/create-paymentPosition.dto';
import { FindPaymentPositionDto } from './dto/find-paymentPosition.dto';
import { UpdatePaymentPositionDto } from './dto/update-paymentPosition.dto';
import { PaymentPosition } from './entities/paymentPosition.entity';
import { PaymentsService } from './payments.service';

@Injectable()
export class PaymentPositionsService extends AvailableForUserCompany {
    public readonly resourceType = ResourceType.PAYMENT;

    constructor(
        @InjectRepository(PaymentPosition)
        private repository: Repository<PaymentPosition>,
        @Inject(forwardRef(() => AccessService))
        public accessService: AccessService,
        @Inject(forwardRef(() => PaymentsService))
        public paymentsService: PaymentsService,
    ) {
        super(accessService);
    }

    async getCompanyId(entityId: number): Promise<number> {
        const paymentPosition = await this.repository.findOneOrFail({ where: { id: entityId } });
        return (await this.paymentsService.findOne(paymentPosition.paymentId)).companyId;
    }

    async create(userId: number, payload: CreatePaymentPositionDto): Promise<PaymentPosition> {
        const created = await this.repository.save({
            ...payload,
            createdUserId: userId,
            updatedUserId: userId,
        });
        return await this.repository.findOneOrFail({ where: { id: created.id } });
    }

    async findAll(params: FindPaymentPositionDto): Promise<PaymentPosition[]> {
        const { paymentId, relations, ...other } = params;
        if (!paymentId) {
            throw new BadRequestException('Should be defined paymentId');
        }
        return await this.repository.find({
            where: { ...other, paymentId },
            relations: {
                payment: relations,
                position: relations,
            },
        });
    }

    async findOne(id: number, relations: boolean = false): Promise<PaymentPosition> {
        const record = await this.repository.findOneOrFail({
            where: { id },
            relations: { payment: relations, position: relations },
        });
        return record;
    }

    async update(
        userId: number,
        id: number,
        payload: UpdatePaymentPositionDto,
    ): Promise<PaymentPosition> {
        const record = await this.repository.findOneOrFail({ where: { id } });
        if (payload.version !== record.version) {
            throw new ConflictException(
                'The record has been updated by another user. Try to edit it after reloading.',
            );
        }
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

    async delete(id: number) {
        await this.repository.delete(id);
    }
}
