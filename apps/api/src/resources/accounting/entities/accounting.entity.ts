import { Logger } from './../../../resources/abstract/logger.abstract';
import { AccountingType } from '@repo/shared';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Accounting extends Logger {
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
