import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { AccountingType } from './../../../types';
import { BaseEntity } from '@/resources/common/base';

@Entity({ name: 'accounting' })
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
