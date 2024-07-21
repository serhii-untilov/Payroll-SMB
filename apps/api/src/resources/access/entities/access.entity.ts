import { ApiProperty } from '@nestjs/swagger';
import { AccessType, ResourceType, RoleType } from './../../../types';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Logger } from './../../abstract/logger.abstract';

@Entity()
export class Access extends Logger {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'varchar', length: 20 })
    @ApiProperty({ enum: RoleType })
    roleType: RoleType;

    @Column({ type: 'varchar', length: 20 })
    @ApiProperty({ enum: ResourceType, enumName: 'ResourceTypeEnum' })
    resourceType: ResourceType;

    @Column({ type: 'varchar', length: 20 })
    @ApiProperty({ enum: AccessType })
    accessType: AccessType;
}
