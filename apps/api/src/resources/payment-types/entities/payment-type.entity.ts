import { IPaymentType } from '@repo/shared';
import { Logger } from '../../abstract/logger.abstract';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PaymentType extends Logger implements IPaymentType {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'varchar', length: 50 })
    name: string;

    @Column({ type: 'varchar', length: 30 })
    paymentGroup: string;

    @Column({ type: 'varchar', length: 30 })
    paymentMethod: string;

    @Column({ type: 'varchar', length: 300 })
    description: string;
}
