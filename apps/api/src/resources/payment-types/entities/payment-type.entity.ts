import { Logger } from './../../abstract/logger.abstract';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PaymentType extends Logger {
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
