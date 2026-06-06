import { IdGenerator } from '@/snowflake/snowflake.singleton';
import { Action, Resource } from '@/types';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseUserAccess } from '../common/base';
import { UserAccessService } from '../user-access/user-access.service';
import { CreateMinWageDto } from './dto/create-min-wage.dto';
import { UpdateMinWageDto } from './dto/update-min-wage.dto';
import { MinWage } from './entities/min-wage.entity';

@Injectable()
export class MinWageService extends BaseUserAccess {
    constructor(
        @InjectRepository(MinWage) private repository: Repository<MinWage>,
        @Inject(forwardRef(() => UserAccessService)) userAccessService: UserAccessService,
    ) {
        super(userAccessService, Resource.MinWage);
    }

    async create(userId: string, payload: CreateMinWageDto): Promise<string> {
        await this.requireAccessOrFail(userId, Action.Create);
        const id = IdGenerator.nextId();
        await this.repository.save({
            ...payload,
            id,
            createdUserId: userId,
            updatedUserId: userId,
        });
        return id;
    }

    async findAll(): Promise<MinWage[]> {
        return await this.repository.find();
    }

    async findOne(userId: string, id: string): Promise<MinWage> {
        await this.requireAccessOrFail(userId, Action.Read, { resourceId: id });
        return await this.repository.findOneOrFail({ where: { id } });
    }

    async update(userId: string, id: string, version: number, payload: UpdateMinWageDto): Promise<void> {
        await this.requireAccessOrFail(userId, Action.Update, { resourceId: id });
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
        await this.requireAccessOrFail(userId, Action.Remove, { resourceId: id });
        await this.repository.update({ id, version }, { deletedDate: new Date(), deletedUserId: userId });
    }
}
