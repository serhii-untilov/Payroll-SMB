import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

    async create(userId: number, PaymentType: CreatePaymentTypeDto): Promise<PaymentType> {
        const existing = await this.PaymentTypesRepository.findOneBy({ name: PaymentType.name });
        if (existing) {
            throw new BadRequestException(`PaymentType '${PaymentType.name}' already exists.`);
        }
        const newPaymentType = await this.PaymentTypesRepository.save({
            ...PaymentType,
            createdUserId: userId,
            updatedUserId: userId,
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

    async update(userId: number, id: number, data: UpdatePaymentTypeDto): Promise<PaymentType> {
        const PaymentType = await this.PaymentTypesRepository.findOneBy({ id });
        if (!PaymentType) {
            throw new NotFoundException(`PaymentType could not be found.`);
        }
        await this.PaymentTypesRepository.save({
            ...data,
            id,
            updatedUserId: userId,
        });
        const updated = await this.PaymentTypesRepository.findOneOrFail({ where: { id } });
        return updated;
    }

    async remove(userId: number, id: number): Promise<PaymentType> {
        const PaymentType = await this.PaymentTypesRepository.findOneBy({ id });
        if (!PaymentType) {
            throw new NotFoundException(`PaymentType could not be found.`);
        }
        await this.PaymentTypesRepository.save({
            ...PaymentType,
            deletedDate: new Date(),
            deletedUserId: userId,
        });
        return PaymentType;
    }
}
