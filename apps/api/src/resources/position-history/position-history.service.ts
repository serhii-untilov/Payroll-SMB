import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePositionHistoryDto } from './dto/create-position-history.dto';
import { UpdatePositionHistoryDto } from './dto/update-position-history.dto';
import { PositionHistory } from './entities/position-history.entity';

@Injectable()
export class PositionHistoryService {
    constructor(
        @InjectRepository(PositionHistory)
        private positionHistoryRepository: Repository<PositionHistory>,
    ) {}

    async create(positionHistory: CreatePositionHistoryDto): Promise<PositionHistory> {
        // TODO
        throw new BadRequestException(`Create PositionHistory fault.`);
        return await this.positionHistoryRepository.save(positionHistory);
    }

    async findAll(): Promise<PositionHistory[]> {
        return await this.positionHistoryRepository.find();
    }

    async findOne(id: number): Promise<PositionHistory> {
        const positionHistory = await this.positionHistoryRepository.findOneBy({ id });
        if (!positionHistory) {
            throw new NotFoundException(`PositionHistory could not be found.`);
        }
        return positionHistory;
    }

    async update(id: number, data: UpdatePositionHistoryDto): Promise<PositionHistory> {
        const positionHistory = await this.positionHistoryRepository.findOneBy({ id });
        if (!positionHistory) {
            throw new NotFoundException(`PositionHistory could not be found.`);
        }
        await this.positionHistoryRepository.save({ id, ...data });
        const updated = await this.positionHistoryRepository.findOneOrFail({ where: { id } });
        return updated;
    }

    async remove(id: number): Promise<PositionHistory> {
        const positionHistory = await this.positionHistoryRepository.findOneBy({ id });
        if (!positionHistory) {
            throw new NotFoundException(`PositionHistory could not be found.`);
        }
        await this.positionHistoryRepository.remove(positionHistory);
        return positionHistory;
    }
}
