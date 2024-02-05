import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ILaw } from './law.interface';

@Entity()
export class Law implements ILaw {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'varchar', length: 50 })
    name: string;
}
