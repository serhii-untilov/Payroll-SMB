import { Logger } from './../../../resources/abstract/logger.abstract';
import { IPayFundType } from '@repo/shared';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PayFundType extends Logger implements IPayFundType {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'varchar', length: 50 })
    name: string;

    @Column({ type: 'varchar', length: 30 })
    group: string; // See enum PayFundGroup

    @Column({ type: 'varchar', length: 30 })
    calcMethod: string; // See enum PayFundCalcMethod

    @Column({ type: 'integer' })
    sequence: number;

    @Column({ type: 'varchar', length: 300, default: '' })
    description: string;
}
