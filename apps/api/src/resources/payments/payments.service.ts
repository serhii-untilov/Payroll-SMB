import {
    BadRequestException,
    ConflictException,
    Inject,
    Injectable,
    forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResourceType, dateUTC } from '@repo/shared';
import { Repository } from 'typeorm';
import { AvailableForUserCompany } from '../abstract/availableForUserCompany';
import { AccessService } from '../access/access.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { FindPaymentDto } from './dto/find-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Payment } from './entities/payment.entity';
import { PaymentPositionsService } from './payment-positions/payment-positions.service';

@Injectable()
export class PaymentsService extends AvailableForUserCompany {
    public readonly resourceType = ResourceType.PAYMENT;

    constructor(
        @InjectRepository(Payment)
        private repository: Repository<Payment>,
        @Inject(forwardRef(() => AccessService))
        public accessService: AccessService,
        @Inject(forwardRef(() => PaymentPositionsService))
        public paymentPositionsService: PaymentPositionsService,
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

    async findOne(id: number, relations: boolean = false): Promise<Payment> {
        const record = await this.repository.findOneOrFail({
            where: { id },
            relations: { company: relations, paymentType: relations },
        });
        return record;
    }

    async findOneBy(params: FindPaymentDto): Promise<Payment | null> {
        const found = await this.findAll(params);
        return found.length ? found[0] : null;
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

    async delete(ids: number[]) {
        await this.repository.delete(ids);
    }

    async getNextDocNumber(companyId: number, payPeriod: Date): Promise<string> {
        const first = await this.repository.findOneBy({ companyId, payPeriod, docNumber: '1' });
        if (!first) return '1';
        const result = await this.repository.query(
            `select coalesce(min(cast(p."docNumber" as integer)), 0) + 1 "freeNumber"
            from payment p
            where p."companyId" = $1
                and p."payPeriod" = $2
                and p."deletedUserId" is NULL
                and p."docNumber" ~ '^[0-9\.]+$' is true
                and not exists (
                    select null
                    from payment p2
                    where p2."companyId" = $1
                        and p2."payPeriod" = $2
                        and p2."deletedUserId" is NULL
                        and (p2."docNumber") ~ '^[0-9\.]+$' is true
                        and cast(p2."docNumber" as integer) = cast(p."docNumber" as integer)  + 1
                )
            `,
            [companyId, dateUTC(payPeriod)],
        );

        return result[0].freeNumber.toString();
    }

    async updateTotals(userId: number, paymentIds: number[]) {
        for (const id of paymentIds) {
            const totals = await this.paymentPositionsService.calculateTotals(id);
            await this.repository.save({
                ...totals,
                id,
                updatedUserId: userId,
                updatedDate: new Date(),
            });
        }
    }
}
