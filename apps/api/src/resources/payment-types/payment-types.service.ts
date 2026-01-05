import { Action, Resource } from '@/types';
import { checkVersionOrFail } from '@/utils';
import { BadRequestException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAccessService } from '../user-access/user-access.service';
import { CreatePaymentTypeDto } from './dto/create-payment-type.dto';
import { FindAllPaymentTypeDto } from './dto/find-all-payment-type.dto';
import { UpdatePaymentTypeDto } from './dto/update-payment-type.dto';
import { PaymentType } from './entities/payment-type.entity';

@Injectable()
export class PaymentTypesService {
    public readonly resource = Resource.PaymentType;

    constructor(
        @InjectRepository(PaymentType)
        private repository: Repository<PaymentType>,
        @Inject(forwardRef(() => UserAccessService))
        private accessService: UserAccessService,
    ) {}

    async create(userId: string, payload: CreatePaymentTypeDto): Promise<PaymentType> {
        const existing = await this.repository.findOneBy({ name: payload.name });
        if (existing) {
            throw new BadRequestException(`PaymentType '${payload.name}' already exists.`);
        }
        await this.accessService.availableForUserOrFail(userId, this.resource, Action.Create);
        return await this.repository.save({
            ...payload,
            createdUserId: userId,
            updatedUserId: userId,
        });
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

    async findOne(id: string) {
        return await this.repository.findOneOrFail({ where: { id } });
    }

    async update(userId: string, id: string, payload: UpdatePaymentTypeDto): Promise<PaymentType> {
        const record = await this.repository.findOneOrFail({ where: { id } });
        checkVersionOrFail(record, payload);
        await this.repository.save({
            ...payload,
            id,
            updatedUserId: userId,
            updatedDate: new Date(),
        });
        return await this.repository.findOneOrFail({ where: { id } });
    }

    async remove(userId: string, id: string): Promise<PaymentType> {
        await this.accessService.availableForUserOrFail(userId, this.resource, Action.Remove);
        await this.repository.findOneOrFail({ where: { id } });
        return await this.repository.save({
            id,
            deletedUserId: userId,
            deletedDate: new Date(),
        });
    }
}
