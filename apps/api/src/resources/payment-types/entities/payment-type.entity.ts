import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../abstract/base-entity.abstract';
import { CalcMethod, PaymentGroup, PaymentPart } from './../../../types';

@Entity()
export class PaymentType extends BaseEntity {
    @Column({ type: 'varchar', length: 50 })
    name: string;

    @Column({ type: 'varchar', length: 30 })
    @ApiProperty({ enum: PaymentPart, enumName: 'PaymentPart' })
    paymentPart: PaymentPart;

    @Column({ type: 'varchar', length: 30 })
    @ApiProperty({ enum: PaymentGroup, enumName: 'PaymentGroup' })
    paymentGroup: PaymentGroup;

    @Column({ type: 'varchar', length: 30 })
    @ApiProperty({ enum: CalcMethod, enumName: 'CalcMethod' })
    calcMethod: CalcMethod;

    @Column({ type: 'varchar', length: 300, default: '' })
    description: string;
}
