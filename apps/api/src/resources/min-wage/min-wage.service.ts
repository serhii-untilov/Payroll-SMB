import { ConflictException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResourceType } from '@/types';
import { Repository } from 'typeorm';
import { AvailableForUser } from '../abstract/availableForUser';
import { AccessService } from '../access/access.service';
import { CreateMinWageDto } from './dto/create-min-wage.dto';
import { UpdateMinWageDto } from './dto/update-min-wage.dto';
import { MinWage } from './entities/min-wage.entity';

@Injectable()
export class MinWageService extends AvailableForUser {
    readonly resourceType = ResourceType.MIN_WAGE;

    constructor(
        @InjectRepository(MinWage)
        private repository: Repository<MinWage>,
        @Inject(forwardRef(() => AccessService))
        public accessService: AccessService,
    ) {
        super(accessService);
    }

    async create(userId: number, payload: CreateMinWageDto): Promise<MinWage> {
        const created = await this.repository.create({
            ...payload,
            createdUserId: userId,
            updatedUserId: userId,
        });
        return await this.repository.findOneOrFail({ where: { id: created.id } });
    }

    async findAll(): Promise<MinWage[]> {
        return await this.repository.find();
    }

    async findOne(id: number): Promise<MinWage> {
        return await this.repository.findOneOrFail({ where: { id } });
    }

    async update(userId: number, id: number, payload: UpdateMinWageDto): Promise<MinWage> {
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

    async remove(userId: number, id: number): Promise<MinWage> {
        await this.repository.save({ id, deletedDate: new Date(), deletedUserId: userId });
        return await this.repository.findOneOrFail({ where: { id }, withDeleted: true });
    }
}
