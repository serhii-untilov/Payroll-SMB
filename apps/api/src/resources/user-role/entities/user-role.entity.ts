import { Column, Entity, JoinColumn, ManyToOne, Relation } from 'typeorm';
import { BaseEntity } from '../../common/base/base-entity.abstract';
import { Company } from '../../companies/entities/company.entity';
import { Role } from '../../roles/entities/role.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class UserRole extends BaseEntity {
    @ManyToOne(() => User, { createForeignKeyConstraints: false })
    user?: Relation<User>;

    @Column()
    userId: string;

    @ManyToOne(() => Role, { createForeignKeyConstraints: false })
    role?: Relation<Role>;

    @Column()
    roleId: string;

    // @ManyToOne(() => Company, { createForeignKeyConstraints: false })
    @ManyToOne(() => Company, (company) => company.users)
    @JoinColumn()
    company?: Relation<Company>;

    @Column({ nullable: true })
    companyId: string;
}
