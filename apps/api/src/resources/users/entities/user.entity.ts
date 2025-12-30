import { Column, Entity, ManyToOne, Relation } from 'typeorm';
import { BaseEntity } from '../../abstract/base-entity.abstract';
import { Role } from '../../roles/entities/role.entity';

@Entity()
export class User extends BaseEntity {
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
    roleId: string;
}
