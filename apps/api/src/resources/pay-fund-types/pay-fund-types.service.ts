import { IdGenerator } from '@/snowflake/snowflake.singleton';
import { Action, Resource } from '@/types';
import { BadRequestException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseUserAccess } from '../common/base';
import { UserAccessService } from '../user-access/user-access.service';
import { CreatePayFundTypeDto } from './dto/create-pay-fund-type.dto';
import { UpdatePayFundTypeDto } from './dto/update-pay-fund-type.dto';
import { PayFundType } from './entities/pay-fund-type.entity';

@Injectable()
export class PayFundTypesService extends BaseUserAccess {
    public readonly resource = Resource.FundType;

    constructor(
        @InjectRepository(PayFundType) private repository: Repository<PayFundType>,
        @Inject(forwardRef(() => UserAccessService)) userAccessService: UserAccessService,
    ) {
        super(userAccessService, Resource.FundType);
    }

    async create(userId: string, dto: CreatePayFundTypeDto): Promise<string> {
        await this.canOrFail(userId, Action.Create);
        const existing = await this.repository.findOneBy({ name: dto.name });
        if (existing) {
            throw new BadRequestException(`FundType '${dto.name}' already exists.`);
        }
        const id = IdGenerator.nextId();
        await this.repository.save({ id, ...dto, createdUserId: userId, updatedUserId: userId });
        return id;
    }

    async update(userId: string, id: string, version: number, dto: UpdatePayFundTypeDto): Promise<void> {
        await this.canOrFail(userId, Action.Update, { resourceId: id });
        await this.repository.update(
            { id, version },
            {
                ...dto,
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

    async findAll(): Promise<PayFundType[]> {
        return await this.repository.find();
    }

    async findOne(userId: string, id: string): Promise<PayFundType> {
        await this.canOrFail(userId, Action.Read, { resourceId: id });
        return await this.repository.findOneOrFail({ where: { id } });
    }
}
