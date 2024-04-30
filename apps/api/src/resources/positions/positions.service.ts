import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessType, ResourceType } from '@repo/shared';
import { Repository } from 'typeorm';
import { AccessService } from '../access/access.service';
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
        private readonly accessService: AccessService,
        public readonly resourceType: ResourceType.POSITION,
    ) {}

    async create(userId: number, data: CreatePositionDto): Promise<Position> {
        if (data?.cardNumber) {
            const existing = data?.cardNumber
                ? await this.positionsRepository.findOne({
                      where: { cardNumber: data.cardNumber },
                  })
                : null;
            if (existing) {
                throw new BadRequestException(`Position '${data.cardNumber}' already exists.`);
            }
        }
        const roleType = await this.usersService.getUserCompanyRoleTypeOrException(
            userId,
            data.companyId,
        );
        this.accessService.availableOrException(roleType, this.resourceType, AccessType.CREATE);
        const cardNumber = data?.cardNumber || (await this.getNextCardNumber(data.companyId));
        return await this.positionsRepository.save({
            ...data,
            cardNumber,
            createdUserId: userId,
            updatedUserId: userId,
        });
    }

    async findAll(
        userId: number,
        companyId: number,
        relations: boolean = false,
    ): Promise<Position[]> {
        const roleType = await this.usersService.getUserCompanyRoleTypeOrException(
            userId,
            companyId,
        );
        this.accessService.availableOrException(roleType, this.resourceType, AccessType.ACCESS);
        return await this.positionsRepository.find({
            where: { companyId },
            relations: {
                company: relations,
                person: relations,
                history: relations
                    ? {
                          department: true,
                          job: true,
                          workNorm: true,
                          paymentType: true,
                      }
                    : false,
            },
        });
    }

    async findOne(userId: number, id: number, relations: boolean = false): Promise<Position> {
        const record = await this.positionsRepository.findOne({
            where: { id },
            relations: {
                company: relations,
                person: relations,
                history: relations
                    ? {
                          department: true,
                          job: true,
                          workNorm: true,
                          paymentType: true,
                      }
                    : false,
            },
        });
        if (!record) {
            throw new NotFoundException(`Position could not be found.`);
        }
        const roleType = await this.usersService.getUserCompanyRoleTypeOrException(
            userId,
            record.companyId,
        );
        this.accessService.availableOrException(roleType, this.resourceType, AccessType.ACCESS);
        return record;
    }

    async update(userId: number, id: number, data: UpdatePositionDto): Promise<Position> {
        const record = await this.positionsRepository.findOneBy({ id });
        if (!record) {
            throw new NotFoundException(`Position could not be found.`);
        }
        const roleType = await this.usersService.getUserCompanyRoleTypeOrException(
            userId,
            record.companyId,
        );
        this.accessService.availableOrException(roleType, this.resourceType, AccessType.UPDATE);
        await this.positionsRepository.save({ ...data, id, updatedUserId: userId });
        return await this.positionsRepository.findOneOrFail({ where: { id } });
    }

    async remove(userId: number, id: number): Promise<Position> {
        const record = await this.positionsRepository.findOneBy({ id });
        if (!record) {
            throw new NotFoundException(`Position could not be found.`);
        }
        const roleType = await this.usersService.getUserCompanyRoleTypeOrException(
            userId,
            record.companyId,
        );
        this.accessService.availableOrException(roleType, this.resourceType, AccessType.DELETE);
        const deleted = {
            ...record,
            deletedDate: new Date(),
            deletedUserId: userId,
        } as Position;
        await this.positionsRepository.save(deleted);
        return deleted;
    }

    async getNextCardNumber(companyId: number): Promise<string> {
        const result = await this.positionsRepository.query(
            `select coalesce(min(cast(p."cardNumber" as integer)), 0) + 1 "freeNumber"
            from position p
            where p."companyId" = $1
                and p."deletedUserId" is NULL
                and p."cardNumber" ~ '^[0-9\.]+$' is true
                and not exists (
                    select null
                    from position p2
                    where p2."companyId" = $2
                        and p2."deletedUserId" is NULL
                        and (p2."cardNumber") ~ '^[0-9\.]+$' is true
                        and cast(p2."cardNumber" as integer) = cast(p."cardNumber" as integer)  + 1
                )
            `,
            [companyId, companyId],
        );

        return result[0].freeNumber.toString();
    }
}
