import { Column, Entity, JoinColumn, ManyToOne, Relation } from 'typeorm';
import { BaseEntity } from '../../abstract/base-entity.abstract';
import { Company } from '../../companies/entities/company.entity';
import { Role } from '../../roles/entities/role.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class UserCompany extends BaseEntity {
    @ManyToOne(() => User, { createForeignKeyConstraints: false })
    user?: Relation<User>;

    @Column()
    userId: string;

    // @ManyToOne(() => Company, { createForeignKeyConstraints: false })
    @ManyToOne(() => Company, (company) => company.users)
    @JoinColumn()
    company?: Relation<Company>;

    @Column()
    companyId: string;

    @ManyToOne(() => Role, { createForeignKeyConstraints: false })
    role?: Relation<Role>;

    @Column()
    roleId: string;
}
