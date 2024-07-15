import {
    BadRequestException,
    ConflictException,
    Inject,
    Injectable,
    NotFoundException,
    forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessType, ResourceType } from '@repo/shared';
import { Repository } from 'typeorm';
import { AccessService } from '../access/access.service';
import { CreatePaymentTypeDto } from './dto/create-payment-type.dto';
import { PaymentTypeFilter } from './dto/find-all-payment-type.dto';
import { UpdatePaymentTypeDto } from './dto/update-payment-type.dto';
import { PaymentType } from './entities/payment-type.entity';

@Injectable()
export class PaymentTypesService {
    public readonly resourceType = ResourceType.PAYMENT_TYPE;

    constructor(
        @InjectRepository(PaymentType)
        private repository: Repository<PaymentType>,
        @Inject(forwardRef(() => AccessService))
        private accessService: AccessService,
    ) {}

    async create(userId: number, payload: CreatePaymentTypeDto): Promise<PaymentType> {
        const existing = await this.repository.findOneBy({ name: payload.name });
        if (existing) {
            throw new BadRequestException(`PaymentType '${payload.name}' already exists.`);
        }
        await this.accessService.availableForUserOrFail(
            userId,
            this.resourceType,
            AccessType.CREATE,
        );
        return await this.repository.save({
            ...payload,
            createdUserId: userId,
            updatedUserId: userId,
        });
    }

    async findAll(filter?: PaymentTypeFilter): Promise<PaymentType[]> {
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

    async findOne(params): Promise<PaymentType> {
        const PaymentType = await this.repository.findOne(params);
        if (!PaymentType) {
            throw new NotFoundException(`PaymentType could not be found.`);
        }
        return PaymentType;
    }

    async update(userId: number, id: number, payload: UpdatePaymentTypeDto): Promise<PaymentType> {
        await this.accessService.availableForUserOrFail(
            userId,
            this.resourceType,
            AccessType.UPDATE,
        );
        const paymentType = await this.repository.findOneOrFail({ where: { id } });
        if (payload.version !== paymentType.version) {
            throw new ConflictException(
                'The record has been updated by another user. Try to edit it after reloading.',
            );
        }
        return await this.repository.save({
            ...payload,
            id,
            updatedUserId: userId,
            updatedDate: new Date(),
        });
    }

    async remove(userId: number, id: number): Promise<PaymentType> {
        await this.accessService.availableForUserOrFail(
            userId,
            this.resourceType,
            AccessType.DELETE,
        );
        await this.repository.findOneOrFail({ where: { id } });
        return await this.repository.save({
            id,
            deletedUserId: userId,
            deletedDate: new Date(),
        });
    }
}
