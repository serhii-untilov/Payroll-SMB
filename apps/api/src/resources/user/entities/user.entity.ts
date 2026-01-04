import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../common/base/base-entity.abstract';

@Entity()
export class User extends BaseEntity {
    @Column({ type: 'varchar', length: 50 })
    firstName: string;

    @Column({ type: 'varchar', length: 50 })
    lastName: string;

    @Column({ type: 'varchar', length: 50 })
    email: string;

    @Column({ type: 'varchar', length: 60 })
    passwordHash: string;

    @Column({ type: 'varchar', nullable: true })
    refreshToken: string | null;

    @Column({ type: 'boolean', default: true })
    isActive: boolean;

    @Column({ type: 'varchar', length: '5', nullable: true })
    language: string | null;
}
