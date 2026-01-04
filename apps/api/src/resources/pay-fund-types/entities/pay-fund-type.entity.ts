import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../common/base/base-entity.abstract';
import { PayFundCalcMethod, PayFundGroup } from './../../../types';

@Entity()
export class PayFundType extends BaseEntity {
    @Column({ type: 'varchar', length: 50 })
    name: string;

    @Column({ type: 'varchar', length: 30 })
    @ApiProperty({ enum: PayFundGroup, enumName: 'PayFundGroup' })
    group: PayFundGroup;

    @Column({ type: 'varchar', length: 30 })
    @ApiProperty({ enum: PayFundCalcMethod, enumName: 'PayFundCalcMethod' })
    calcMethod: PayFundCalcMethod;

    @Column({ type: 'integer' })
    sequence: number;

    @Column({ type: 'varchar', length: 300, default: '' })
    description: string;
}
