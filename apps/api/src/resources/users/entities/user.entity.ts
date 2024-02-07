import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IUser } from '@repo/shared';

@Entity()
export class User implements IUser {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'varchar', length: 50 })
    name: string;

    @Column({ type: 'varchar', length: 50 })
    email: string;

    @Column({ type: 'varchar', length: 50 })
    password: string;

    @Column({ type: 'boolean', default: true })
    isActive: boolean;
}
