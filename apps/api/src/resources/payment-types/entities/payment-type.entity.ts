import { CalcMethod, PaymentGroup, PaymentPart } from './../../../types';
import { Logger } from './../../abstract/logger.abstract';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class PaymentType extends Logger {
    @PrimaryGeneratedColumn('increment')
    id: number;

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
