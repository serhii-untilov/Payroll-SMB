import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { RoleType } from '../../../types';
import { BaseEntity } from '@/resources/common/base';

@Entity()
export class Role extends BaseEntity {
    @Column({ type: 'varchar', length: 50, unique: true })
    name: string;

    @Column({ type: 'varchar', length: 15, default: RoleType.Manager })
    @ApiProperty({ enum: RoleType, enumName: 'RoleType' })
    type: RoleType;
}
