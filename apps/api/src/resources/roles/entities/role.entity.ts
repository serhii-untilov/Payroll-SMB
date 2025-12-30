import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { RoleType } from './../../../types';
import { BaseEntity } from '@/resources/abstract';

@Entity()
export class Role extends BaseEntity {
    @Column({ type: 'varchar', length: 50 })
    name: string;

    @Column({ type: 'varchar', length: 15, default: RoleType.Manager })
    @ApiProperty({ enum: RoleType, enumName: 'RoleType' })
    type: RoleType;

    // @ManyToMany(() => User, (user) => user.roles)
    // users?: User[];
}
