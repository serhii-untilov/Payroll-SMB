import { CompaniesService } from './../companies/companies.service';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { Position } from './entities/position.entity';

@Injectable()
export class PositionsService {
    constructor(
        @InjectRepository(Position)
        private positionsRepository: Repository<Position>,
        private readonly usersService: UsersService,
        private readonly companiesService: CompaniesService,
    ) {}

    async create(userId: number, position: CreatePositionDto): Promise<Position> {
        if (position?.cardNumber) {
            const existing = position?.cardNumber
                ? await this.positionsRepository.findOne({
                      where: { cardNumber: position.cardNumber },
                  })
                : null;
            if (existing) {
                throw new BadRequestException(`Position '${position.cardNumber}' already exists.`);
            }
        }
        const cardNumber = position?.cardNumber || (await this.nextCardNumber(position.companyId));

        const user = await this.usersService.findOne({ where: { id: userId } });
        if (!user) {
            throw new BadRequestException(`User '${userId}' not found.`);
        }
        const company = await this.companiesService.findOne({ where: { id: position.companyId } });
        if (!company) {
            throw new BadRequestException(`Company '${position.companyId}' not found.`);
        }
        return await this.positionsRepository.save({
            ...position,
            cardNumber,
            createdUserId: userId,
            updatedUserId: userId,
        });
    }

    async findAll(params): Promise<Position[]> {
        return await this.positionsRepository.find(params);
    }

    async findOne(params): Promise<Position> {
        const position = await this.positionsRepository.findOne(params);
        if (!position) {
            throw new NotFoundException(`Position could not be found.`);
        }
        return position;
    }

    async update(userId: number, id: number, data: UpdatePositionDto): Promise<Position> {
        const position = await this.positionsRepository.findOneBy({ id });
        if (!position) {
            throw new NotFoundException(`Position could not be found.`);
        }
        const user = await this.usersService.findOne({ where: { id: userId } });
        if (!user) {
            throw new BadRequestException(`User '${userId}' not found.`);
        }
        await this.positionsRepository.save({ ...data, id, updatedUserId: userId });
        const updated = await this.positionsRepository.findOneOrFail({ where: { id } });
        return updated;
    }

    async remove(userId: number, id: number): Promise<Position> {
        const position = await this.positionsRepository.findOneBy({ id });
        if (!position) {
            throw new NotFoundException(`Position could not be found.`);
        }
        const user = await this.usersService.findOne({ where: { id: userId } });
        if (!user) {
            throw new BadRequestException(`User '${userId}' not found.`);
        }
        await this.positionsRepository.save({
            ...position,
            deletedDate: new Date(),
            deletedUserId: userId,
        });
        return position;
    }

    async nextCardNumber(companyId: number): Promise<string> {
        const result = await this.positionsRepository.query(
            `select coalesce(min(cast(p."cardNumber" as integer)), 0) + 1 "freeNumber"
            from position p
            where p."companyId" = $1
                and p."cardNumber" ~ '^[0-9\.]+$' is true
                and not exists (
                    select null
                    from position p2
                    where p2."companyId" = $2
                        and (p2."cardNumber") ~ '^[0-9\.]+$' is true
                        and cast(p2."cardNumber" as integer) = cast(p."cardNumber" as integer)  + 1
                )
            `,
            [companyId, companyId],
        );

        return result[0].freeNumber.toString();
    }
}
