import { Resource } from '@/types';
import { checkVersionOrFail } from '@/utils';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AvailableForUser } from '../abstract/available-for-user';
import { AccessService } from '../access/access.service';
import { CreateMinWageDto } from './dto/create-min-wage.dto';
import { UpdateMinWageDto } from './dto/update-min-wage.dto';
import { MinWage } from './entities/min-wage.entity';

@Injectable()
export class MinWageService extends AvailableForUser {
    readonly resource = Resource.MinWage;

    constructor(
        @InjectRepository(MinWage)
        private repository: Repository<MinWage>,
        @Inject(forwardRef(() => AccessService))
        public accessService: AccessService,
    ) {
        super(accessService);
    }

    async create(userId: string, payload: CreateMinWageDto): Promise<MinWage> {
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

    async findOne(id: string): Promise<MinWage> {
        return await this.repository.findOneOrFail({ where: { id } });
    }

    async update(userId: string, id: string, payload: UpdateMinWageDto): Promise<MinWage> {
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

    async remove(userId: string, id: string): Promise<MinWage> {
        await this.repository.save({ id, deletedDate: new Date(), deletedUserId: userId });
        return await this.repository.findOneOrFail({ where: { id }, withDeleted: true });
    }
}
