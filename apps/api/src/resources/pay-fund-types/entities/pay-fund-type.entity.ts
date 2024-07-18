import { ApiProperty } from '@nestjs/swagger';
import { PayFundCalcMethod, PayFundGroup } from '@/types';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Logger } from './../../abstract/logger.abstract';

@Entity()
export class PayFundType extends Logger {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'varchar', length: 50 })
    name: string;

    @Column({ type: 'varchar', length: 30 })
    @ApiProperty({ enum: PayFundGroup })
    group: PayFundGroup;

    @Column({ type: 'varchar', length: 30 })
    @ApiProperty({ enum: PayFundCalcMethod })
    calcMethod: PayFundCalcMethod;

    @Column({ type: 'integer' })
    sequence: number;

    @Column({ type: 'varchar', length: 300, default: '' })
    description: string;
}
