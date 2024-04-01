import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Position } from './entities/position.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PositionsService {
    constructor(
        @InjectRepository(Position)
        private positionsRepository: Repository<Position>,
    ) {}

    async create(position: CreatePositionDto): Promise<Position> {
        const existing = this.positionsRepository.findOne({
            where: { idNumber: position.idNumber },
        });
        if (existing) {
            throw new BadRequestException(`Position '${position.idNumber}' already exists.`);
        }
        return await this.positionsRepository.save(position);
    }

    async findAll(): Promise<Position[]> {
        return await this.positionsRepository.find();
    }

    async findOne(id: number): Promise<Position> {
        const position = await this.positionsRepository.findOneBy({ id });
        if (!position) {
            throw new NotFoundException(`Position could not be found.`);
        }
        return position;
    }

    async update(id: number, data: UpdatePositionDto): Promise<Position> {
        const position = await this.positionsRepository.findOneBy({ id });
        if (!position) {
            throw new NotFoundException(`Position could not be found.`);
        }
        await this.positionsRepository.save({ id, ...data });
        const updated = await this.positionsRepository.findOneOrFail({ where: { id } });
        return updated;
    }

    async remove(id: number): Promise<Position> {
        const position = await this.positionsRepository.findOneBy({ id });
        if (!position) {
            throw new NotFoundException(`Position could not be found.`);
        }
        await this.positionsRepository.remove(position);
        return position;
    }
}
