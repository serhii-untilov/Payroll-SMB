import { WrapperType } from '@/types';
import {
    BadRequestException,
    ConflictException,
    Inject,
    Injectable,
    Logger,
    forwardRef,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentStatus, RecordFlags, ResourceType, dateUTC } from '@/types';
import { Repository } from 'typeorm';
import { AvailableForUserCompany } from '../abstract/availableForUserCompany';
import { AccessService } from '../access/access.service';
import { CompaniesService } from '../companies/companies.service';
import { PayPeriodsService } from '../pay-periods/pay-periods.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { FindAllPaymentDto } from './dto/find-all-payment.dto';
import { FindOnePaymentDto } from './dto/find-one-payment.dto';
import { ProcessPaymentDto } from './dto/process-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { WithdrawPaymentDto } from './dto/withdraw-payment.dto';
import { Payment } from './entities/payment.entity';
import { PaymentUpdatedEvent } from './events/payment-updated.event';
import { PaymentPositionsService } from '../payment-positions/payment-positions.service';

@Injectable()
export class PaymentsService extends AvailableForUserCompany {
    public readonly resourceType = ResourceType.PAYMENT;
    private logger: Logger = new Logger(PaymentsService.name);

    constructor(
        @InjectRepository(Payment)
        private repository: Repository<Payment>,
        @Inject(forwardRef(() => AccessService))
        public accessService: WrapperType<AccessService>,
        @Inject(forwardRef(() => PaymentPositionsService))
        public paymentPositionsService: WrapperType<PaymentPositionsService>,
        @Inject(forwardRef(() => PayPeriodsService))
        public payPeriodsService: WrapperType<PayPeriodsService>,
        @Inject(forwardRef(() => CompaniesService))
        public companiesService: WrapperType<CompaniesService>,
        private eventEmitter: EventEmitter2,
    ) {
        super(accessService);
    }

    async getCompanyId(entityId: number): Promise<number> {
        return (await this.repository.findOneOrFail({ where: { id: entityId } })).companyId;
    }

    async create(userId: number, payload: CreatePaymentDto): Promise<Payment> {
        const { companyId, payPeriod, accPeriod, ...other } = payload;
        const company = await this.companiesService.findOne(userId, payload.companyId);
        const accPeriodRecord = await this.payPeriodsService.findOneBy({
            where: {
                companyId,
                dateFrom: accPeriod ?? payPeriod ?? company.payPeriod,
            },
        });
        const created = await this.repository.save({
            ...other,
            payPeriod: payPeriod ?? company.payPeriod,
            accPeriod: accPeriod ?? payPeriod ?? company.payPeriod,
            docNumber:
                payload.docNumber ||
                (await this.getNextDocNumber(payload.companyId, payPeriod ?? company.payPeriod)),
            docDate: payload.docDate || dateUTC(new Date()),
            dateFrom: payload.dateFrom || accPeriodRecord.dateFrom,
            dateTo: payload.dateTo || accPeriodRecord.dateTo,
            status: payload.status || PaymentStatus.DRAFT,
            recordFlags: payload.recordFlags || RecordFlags.AUTO,
            createdUserId: userId,
            updatedUserId: userId,
        });
        return await this.repository.findOneOrFail({ where: { id: created.id } });
    }

    async findAll(params: FindAllPaymentDto): Promise<Payment[]> {
        const { companyId, positionId, payPeriod, accPeriod, status, relations } = params;
        if (!companyId) {
            throw new BadRequestException('Should be defined companyId');
        }
        return await this.repository.find({
            relations: {
                company: relations,
                paymentType: relations,
            },
            where: {
                companyId,
                // TODO: check result for the positionId parameter
                ...(positionId ? { paymentPositions: { positionId } } : {}),
                ...(payPeriod ? { payPeriod } : {}),
                ...(accPeriod ? { accPeriod } : {}),
                ...(status ? { status } : {}),
            },
        });
    }

    async findOne(id: number, params?: FindOnePaymentDto): Promise<Payment> {
        const record = await this.repository.findOneOrFail({
            where: { id },
            relations: { company: !!params?.relations, paymentType: !!params?.relations },
        });
        return record;
    }

    async findOneBy(params: FindAllPaymentDto): Promise<Payment | null> {
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
        const updated = await this.repository.findOneOrFail({ where: { id } });
        return updated;
    }

    async remove(userId: number, id: number): Promise<Payment> {
        await this.repository.save({ id, deletedDate: new Date(), deletedUserId: userId });
        const deleted = await this.repository.findOneOrFail({ where: { id }, withDeleted: true });
        return deleted;
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

    async process(userId: number, id: number, payload: ProcessPaymentDto): Promise<Payment> {
        const record = await this.repository.findOneOrFail({
            where: { id },
            relations: { company: true, paymentType: true },
        });
        if (record.status === PaymentStatus.PAYED) return record;
        await this.paymentPositionsService.process(userId, record);
        await this.update(userId, id, { status: PaymentStatus.PAYED, version: payload.version });
        const updated = await this.repository.findOneOrFail({ where: { id } });
        this.eventEmitter.emit('payment.updated', new PaymentUpdatedEvent(userId, updated));
        return updated;
    }

    async withdraw(userId: number, id: number, payload: WithdrawPaymentDto): Promise<Payment> {
        const record = await this.repository.findOneOrFail({
            where: { id },
            relations: { company: true, paymentType: true },
        });
        if (record.status === PaymentStatus.DRAFT) return record;
        await this.paymentPositionsService.withdraw(id);
        await this.update(userId, id, { status: PaymentStatus.DRAFT, version: payload.version });
        const updated = await this.repository.findOneOrFail({ where: { id } });
        this.eventEmitter.emit('payment.updated', new PaymentUpdatedEvent(userId, updated));
        return updated;
    }
}
