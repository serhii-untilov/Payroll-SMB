import { IUser } from '@repo/shared';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../../roles/entities/role.entity';

@Entity()
export class User implements IUser {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'varchar', length: 50 })
    firstName: string;

    @Column({ type: 'varchar', length: 50 })
    lastName: string;

    @Column({ type: 'varchar', length: 50 })
    email: string;

    @Column({ type: 'varchar', length: 50 })
    password: string;

    @Column({ type: 'varchar', nullable: true })
    refreshToken: string;

    @Column({ type: 'boolean', default: true })
    isActive: boolean;

    @ManyToMany(() => Role, (role) => role.users, { cascade: true })
    @JoinTable({ name: 'user_roles' })
    roles: Role[];
}
