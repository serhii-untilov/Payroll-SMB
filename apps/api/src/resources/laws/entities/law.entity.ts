import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ILaw } from '@repo/shared';
import { Company } from '../../companies/entities/company.entity';

@Entity()
export class Law implements ILaw {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'varchar', length: 50 })
    name: string;

    @OneToMany(() => Company, (company) => company.law)
    companies: Company[];
}
