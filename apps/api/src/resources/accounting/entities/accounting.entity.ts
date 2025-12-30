import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../abstract/base-entity.abstract';
import { AccountingType } from './../../../types';

@Entity()
export class Accounting extends BaseEntity {
    @Column({ type: 'varchar', length: 50 })
    name: string;

    @Column({
        type: 'varchar',
        length: 15,
        default: AccountingType.Generic,
    })
    @ApiProperty({ enum: AccountingType, enumName: 'AccountingType' })
    type: AccountingType;
}
