import { Logger } from './../../../resources/abstract/logger.abstract';
import { IPaymentType } from '@repo/shared';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PaymentType extends Logger implements IPaymentType {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'varchar', length: 50 })
    name: string;

    @Column({ type: 'varchar', length: 30 })
    paymentPart: string;

    @Column({ type: 'varchar', length: 30 })
    paymentGroup: string;

    @Column({ type: 'varchar', length: 30 })
    calcMethod: string;

    @Column({ type: 'varchar', length: 300 })
    description: string;
}
