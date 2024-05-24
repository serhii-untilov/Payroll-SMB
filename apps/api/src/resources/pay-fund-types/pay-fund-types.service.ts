import {
    BadRequestException,
    ConflictException,
    Inject,
    Injectable,
    forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessType, ResourceType } from '@repo/shared';
import { Repository } from 'typeorm';
import { AccessService } from '../access/access.service';
import { CreatePayFundTypeDto } from './dto/create-pay-fund-type.dto';
import { UpdatePayFundTypeDto } from './dto/update-pay-fund-type.dto';
import { PayFundType } from './entities/pay-fund-type.entity';

@Injectable()
export class FundTypesService {
    public readonly resourceType = ResourceType.FUND_TYPE;

    constructor(
        @InjectRepository(PayFundType)
        private repository: Repository<PayFundType>,
        @Inject(forwardRef(() => AccessService))
        private accessService: AccessService,
    ) {}

    async availableFindAllOrFail(userId: number) {
        await this.accessService.availableForUserOrFail(
            userId,
            this.resourceType,
            AccessType.ACCESS,
        );
    }

    async availableFindOneOrFail(userId: number) {
        await this.accessService.availableForUserOrFail(
            userId,
            this.resourceType,
            AccessType.ACCESS,
        );
    }

    async availableCreateOrFail(userId: number) {
        await this.accessService.availableForUserOrFail(
            userId,
            this.resourceType,
            AccessType.CREATE,
        );
    }

    async availableUpdateOrFail(userId: number) {
        await this.accessService.availableForUserOrFail(
            userId,
            this.resourceType,
            AccessType.UPDATE,
        );
    }

    async availableDeleteOrFail(userId: number) {
        await this.accessService.availableForUserOrFail(
            userId,
            this.resourceType,
            AccessType.DELETE,
        );
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
        return await this.repository.findOneBy({ id });
    }

    async update(userId: number, id: number, payload: UpdatePayFundTypeDto): Promise<PayFundType> {
        const fundType = await this.repository.findOneOrFail({ where: { id } });
        if (payload.version !== fundType.version) {
            throw new ConflictException(
                'The record has been updated by another user. Try to edit it after reloading.',
            );
        }
        return await this.repository.save({
            ...payload,
            id,
            updatedUserId: userId,
        });
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
