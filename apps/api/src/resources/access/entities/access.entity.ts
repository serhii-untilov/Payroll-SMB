import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../abstract/base-entity.abstract';
import { Action, Resource, RoleType } from '../../../types';

@Entity()
export class Access extends BaseEntity {
    @Column({ type: 'varchar', length: 20 })
    @ApiProperty({ enum: RoleType, enumName: 'RoleType' })
    roleType: RoleType;

    @Column({ type: 'varchar', length: 20 })
    @ApiProperty({ enum: Resource, enumName: 'Resource' })
    resource: Resource;

    @Column({ type: 'varchar', length: 20 })
    @ApiProperty({ enum: Action, enumName: 'Action' })
    action: Action;
}
