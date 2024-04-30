import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessType, ResourceType } from '@repo/shared';
import { Repository } from 'typeorm';
import { AccessService } from '../access/access.service';
import { PositionsService } from '../positions/positions.service';
import { UsersService } from '../users/users.service';
import { CreatePositionHistoryDto } from './dto/create-position-history.dto';
import { UpdatePositionHistoryDto } from './dto/update-position-history.dto';
import { PositionHistory } from './entities/position-history.entity';

@Injectable()
export class PositionHistoryService {
    constructor(
        @InjectRepository(PositionHistory)
        private positionHistoryRepository: Repository<PositionHistory>,
        private readonly usersService: UsersService,
        private readonly positionsService: PositionsService,
        private readonly accessService: AccessService,
        public readonly resourceType: ResourceType.POSITION,
    ) {}

    async create(userId: number, data: CreatePositionHistoryDto): Promise<PositionHistory> {
        const position = await this.positionsService.findOne(userId, data.positionId);
        const roleType = await this.usersService.getUserCompanyRoleTypeOrException(
            userId,
            position.companyId,
        );
        this.accessService.availableOrException(roleType, this.resourceType, AccessType.CREATE);
        return await this.positionHistoryRepository.save({
            ...data,
            createdUserId: userId,
            updatedUserId: userId,
        });
    }

    async findAll(
        userId: number,
        positionId: number,
        relations: boolean,
    ): Promise<PositionHistory[]> {
        const position = await this.positionsService.findOne(userId, positionId);
        const roleType = await this.usersService.getUserCompanyRoleTypeOrException(
            userId,
            position.companyId,
        );
        this.accessService.availableOrException(roleType, this.resourceType, AccessType.ACCESS);
        return await this.positionHistoryRepository.find({
            where: {
                positionId,
            },
            relations: {
                position: relations,
                department: relations,
                job: relations,
                workNorm: relations,
                paymentType: relations,
            },
        });
    }

    async findOne(
        userId: number,
        id: number,
        relations: boolean = false,
    ): Promise<PositionHistory> {
        const record = await this.positionHistoryRepository.findOne({
            where: { id },
            relations: {
                position: relations,
                department: relations,
                job: relations,
                workNorm: relations,
                paymentType: relations,
            },
        });
        if (!record) {
            throw new NotFoundException(`PositionHistory could not be found.`);
        }
        const position = await this.positionsService.findOne(userId, record.positionId);
        const roleType = await this.usersService.getUserCompanyRoleTypeOrException(
            userId,
            position?.companyId,
        );
        this.accessService.availableOrException(roleType, this.resourceType, AccessType.ACCESS);
        return record;
    }

    async update(
        userId: number,
        id: number,
        data: UpdatePositionHistoryDto,
    ): Promise<PositionHistory> {
        const record = await this.positionHistoryRepository.findOneBy({ id });
        if (!record) {
            throw new NotFoundException(`PositionHistory could not be found.`);
        }
        const position = await this.positionsService.findOne(userId, record.positionId);
        const roleType = await this.usersService.getUserCompanyRoleTypeOrException(
            userId,
            position.companyId,
        );
        this.accessService.availableOrException(roleType, this.resourceType, AccessType.UPDATE);
        await this.positionHistoryRepository.save({ id, ...data });
        return await this.positionHistoryRepository.findOneOrFail({ where: { id } });
    }

    async remove(userId: number, id: number): Promise<PositionHistory> {
        const record = await this.positionHistoryRepository.findOneBy({ id });
        if (!record) {
            throw new NotFoundException(`PositionHistory could not be found.`);
        }
        const position = await this.positionsService.findOne(userId, record.positionId);
        const roleType = await this.usersService.getUserCompanyRoleTypeOrException(
            userId,
            position.companyId,
        );
        this.accessService.availableOrException(roleType, this.resourceType, AccessType.DELETE);
        const deleted = {
            ...record,
            deletedDate: new Date(),
            deletedUserId: userId,
        } as PositionHistory;
        await this.positionHistoryRepository.save(deleted);
        return deleted;
    }
}
