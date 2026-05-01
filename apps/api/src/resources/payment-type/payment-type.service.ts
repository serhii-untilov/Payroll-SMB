import { IdGenerator } from '@/snowflake/snowflake.singleton';
import { Action, Resource } from '@/types';
import { BadRequestException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseUserAccess } from '../common/base';
import { UserAccessService } from '../user-access/user-access.service';
import { CreatePaymentTypeDto } from './dto/create-payment-type.dto';
import { FindAllPaymentTypeDto } from './dto/find-all-payment-type.dto';
import { UpdatePaymentTypeDto } from './dto/update-payment-type.dto';
import { PaymentType } from './entities/payment-type.entity';

@Injectable()
export class PaymentTypeService extends BaseUserAccess {
    public readonly resource = Resource.PaymentType;

    constructor(
        @InjectRepository(PaymentType) private repository: Repository<PaymentType>,
        @Inject(forwardRef(() => UserAccessService)) userAccessService: UserAccessService,
    ) {
        super(userAccessService, Resource.PaymentType);
    }

    async create(userId: string, payload: CreatePaymentTypeDto): Promise<string> {
        await this.canOrFail(userId, Action.Create);
        const existing = await this.repository.findOneBy({ name: payload.name });
        if (existing) {
            throw new BadRequestException(`PaymentType '${payload.name}' already exists.`);
        }
        const id = IdGenerator.nextId();
        await this.repository.save({ id, ...payload, createdUserId: userId, updatedUserId: userId });
        return id;
    }

    async findAll(filter?: FindAllPaymentTypeDto): Promise<PaymentType[]> {
        return filter?.part || filter?.groups || filter?.methods || filter?.ids
            ? await this.repository
                  .createQueryBuilder('payment_type')
                  .where(
                      `${filter?.part ? '"paymentPart" = :part' : '1=1'}` +
                          `${filter?.groups ? ' AND "paymentGroup" = ANY (:groups)' : ''} ` +
                          `${filter?.methods ? ' AND "calcMethod" = ANY (:methods)' : ''} ` +
                          `${filter?.ids ? ' AND "id" = ANY (:ids)' : ''} `,
                      {
                          part: filter?.part,
                          groups: filter?.groups,
                          methods: filter?.methods,
                          ids: filter?.ids,
                      },
                  )
                  .getMany()
            : await this.repository.find();
    }

    async findOne(userId: string, id: string): Promise<PaymentType> {
        await this.canOrFail(userId, Action.Read, { resourceId: id });
        return await this.repository.findOneOrFail({ where: { id } });
    }

    async update(userId: string, id: string, version: number, payload: UpdatePaymentTypeDto): Promise<void> {
        await this.canOrFail(userId, Action.Update, { resourceId: id });
        await this.repository.update(
            { id, version },
            {
                ...payload,
                updatedUserId: userId,
                updatedDate: new Date(),
            },
        );
        await this.repository.findOneOrFail({ where: { id } });
    }

    async remove(userId: string, id: string, version: number): Promise<void> {
        await this.canOrFail(userId, Action.Remove, { resourceId: id });
        await this.repository.update({ id, version }, { deletedDate: new Date(), deletedUserId: userId });
    }
}
