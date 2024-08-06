import { ResourceType } from '@/types';
import { checkVersionOrFail } from '@/utils';
import { BadRequestException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AvailableForUser } from '../abstract/availableForUser';
import { AccessService } from '../access/access.service';
import { CreatePayFundTypeDto } from './dto/create-pay-fund-type.dto';
import { UpdatePayFundTypeDto } from './dto/update-pay-fund-type.dto';
import { PayFundType } from './entities/pay-fund-type.entity';

@Injectable()
export class PayFundTypesService extends AvailableForUser {
    public readonly resourceType = ResourceType.FundType;

    constructor(
        @InjectRepository(PayFundType)
        private repository: Repository<PayFundType>,
        @Inject(forwardRef(() => AccessService))
        accessService: AccessService,
    ) {
        super(accessService);
    }

    async create(userId: number, payload: CreatePayFundTypeDto): Promise<PayFundType> {
        const existing = await this.repository.findOneBy({ name: payload.name });
        if (existing) {
            throw new BadRequestException(`FundType '${payload.name}' already exists.`);
        }
        return await this.repository.save({
            ...payload,
            createdUserId: userId,
            updatedUserId: userId,
        });
    }

    async findAll(): Promise<PayFundType[]> {
        return await this.repository.find();
    }

    async findOne(id: number): Promise<PayFundType> {
        return await this.repository.findOneOrFail({ where: { id } });
    }

    async update(userId: number, id: number, payload: UpdatePayFundTypeDto): Promise<PayFundType> {
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

    async remove(userId: number, id: number): Promise<PayFundType> {
        await this.repository.findOneOrFail({ where: { id } });
        return await this.repository.save({
            id,
            deletedUserId: userId,
            deletedDate: new Date(),
        });
    }
}
