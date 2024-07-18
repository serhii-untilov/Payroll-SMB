import { Role } from '../../roles/entities/role.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { Logger } from './../../abstract/logger.abstract';

@Entity()
export class User extends Logger {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'varchar', length: 50 })
    firstName: string;

    @Column({ type: 'varchar', length: 50 })
    lastName: string;

    @Column({ type: 'varchar', length: 50 })
    email: string;

    @Column({ type: 'varchar', length: 60 })
    password: string;

    @Column({ type: 'varchar', nullable: true })
    refreshToken: string | null;

    @Column({ type: 'boolean', default: true })
    isActive: boolean;

    @Column({ type: 'varchar', length: '5', nullable: true })
    language: string | null;

    @ManyToOne(() => Role, { createForeignKeyConstraints: false })
    role?: Relation<Role>;

    @Column()
    roleId: number;
}
