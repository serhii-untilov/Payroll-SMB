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
import { CreatePaymentDto } from './dto/create-payment.dto';
import { FindPaymentDto } from './dto/find-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Payment } from './entities/payment.entity';

@Injectable()
export class PaymentsService extends AvailableForUserCompany {
    public readonly resourceType = ResourceType.PAYMENT;

    constructor(
        @InjectRepository(Payment)
        private repository: Repository<Payment>,
        @Inject(forwardRef(() => AccessService))
        public accessService: AccessService,
    ) {
        super(accessService);
    }

    async getCompanyId(entityId: number): Promise<number> {
        return (await this.repository.findOneOrFail({ where: { id: entityId } })).companyId;
    }

    async create(userId: number, payload: CreatePaymentDto): Promise<Payment> {
        const created = await this.repository.save({
            ...payload,
            createdUserId: userId,
            updatedUserId: userId,
        });
        return await this.repository.findOneOrFail({ where: { id: created.id } });
    }

    async findAll(params: FindPaymentDto): Promise<Payment[]> {
        const { companyId, payPeriod, relations, ...other } = params;
        if (!companyId) {
            throw new BadRequestException('Should be defined companyId');
        }
        return await this.repository.find({
            where: {
                ...other,
                ...(payPeriod ? { payPeriod } : {}),
                companyId,
            },
            relations: {
                company: relations,
                paymentType: relations,
            },
        });
    }

    async findOne(id: number, relations: boolean): Promise<Payment> {
        const record = await this.repository.findOneOrFail({
            where: { id },
            relations: { company: relations, paymentType: relations },
        });
        return record;
    }

    async update(userId: number, id: number, payload: UpdatePaymentDto): Promise<Payment> {
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

    async remove(userId: number, id: number): Promise<Payment> {
        await this.repository.save({ id, deletedDate: new Date(), deletedUserId: userId });
        return await this.repository.findOneOrFail({ where: { id }, withDeleted: true });
    }

    async delete(id: number) {
        await this.repository.delete(id);
    }
}
