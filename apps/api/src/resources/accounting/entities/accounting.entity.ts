import { AccountingType, IAccounting } from '@repo/shared';
import { Logger } from '../../../resources/abstract/logger.abstract';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Accounting extends Logger implements IAccounting {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'varchar', length: 50 })
    name: string;

    @Column({
        type: 'varchar',
        length: 15,
        default: AccountingType.GENERIC,
    })
    type: string;
}
