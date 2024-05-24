import { IMaxBaseUSC } from '@repo/shared';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Logger } from '../../../resources/abstract/logger.abstract';

@Entity()
export class MaxBaseUSC extends Logger implements IMaxBaseUSC {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'date', default: '1900-01-01' })
    dateFrom: Date;

    @Column({ type: 'date', default: '9999-12-31' })
    dateTo: Date;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    paySum: number;
}
