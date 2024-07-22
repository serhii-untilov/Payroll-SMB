import { ApiProperty } from '@nestjs/swagger';
import { AccountingType } from './../../../types';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Logger } from './../../abstract/logger.abstract';

@Entity()
export class Accounting extends Logger {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'varchar', length: 50 })
    name: string;

    @Column({
        type: 'varchar',
        length: 15,
        default: AccountingType.Generic,
    })
    @ApiProperty({ enum: AccountingType, enumName: 'AccountingType' })
    type: AccountingType;
}
