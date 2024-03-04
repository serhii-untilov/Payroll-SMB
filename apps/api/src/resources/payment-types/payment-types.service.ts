import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IUser } from '@repo/shared';
import { Repository } from 'typeorm';
import { CreatePaymentTypeDto } from './dto/create-payment-type.dto';
import { UpdatePaymentTypeDto } from './dto/update-payment-type.dto';
import { PaymentType } from './entities/payment-type.entity';

@Injectable()
export class PaymentTypesService {
    constructor(
        @InjectRepository(PaymentType)
        private PaymentTypesRepository: Repository<PaymentType>,
    ) {}

    async create(user: IUser, PaymentType: CreatePaymentTypeDto): Promise<PaymentType> {
        const existing = await this.PaymentTypesRepository.findOneBy({ name: PaymentType.name });
        if (existing) {
            throw new BadRequestException(`PaymentType '${PaymentType.name}' already exists.`);
        }
        const newPaymentType = await this.PaymentTypesRepository.save({
            ...PaymentType,
            owner: user,
            createdUser: user,
            updatedUser: user,
        });
        return newPaymentType;
    }

    async findAll(): Promise<PaymentType[]> {
        return await this.PaymentTypesRepository.find();
    }

    async findOne(params): Promise<PaymentType> {
        const PaymentType = await this.PaymentTypesRepository.findOne(params);
        if (!PaymentType) {
            throw new NotFoundException(`PaymentType could not be found.`);
        }
        return PaymentType;
    }

    async update(user: IUser, id: number, data: UpdatePaymentTypeDto): Promise<PaymentType> {
        const PaymentType = await this.PaymentTypesRepository.findOneBy({ id });
        if (!PaymentType) {
            throw new NotFoundException(`PaymentType could not be found.`);
        }
        await this.PaymentTypesRepository.save({
            ...data,
            id,
            updatedUser: user,
        });
        const updated = await this.PaymentTypesRepository.findOneOrFail({ where: { id } });
        return updated;
    }

    async remove(user: IUser, id: number): Promise<PaymentType> {
        const PaymentType = await this.PaymentTypesRepository.findOneBy({ id });
        if (!PaymentType) {
            throw new NotFoundException(`PaymentType could not be found.`);
        }
        await this.PaymentTypesRepository.save({
            ...PaymentType,
            deletedDate: new Date(),
            deletedUser: user,
        });
        return PaymentType;
    }
}
