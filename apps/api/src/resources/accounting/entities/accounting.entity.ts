import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IAccounting } from '@repo/shared';
import { Company } from '../../companies/entities/company.entity';

@Entity()
export class Accounting implements IAccounting {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'varchar', length: 50 })
    name: string;

    @OneToMany(() => Company, (company) => company.accounting)
    companies: Company[];
}
