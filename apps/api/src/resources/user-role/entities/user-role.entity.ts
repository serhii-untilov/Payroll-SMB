import { Column, Entity, JoinColumn, ManyToOne, Relation } from 'typeorm';
import { BaseEntity } from '../../common/base/base-entity.abstract';
import { CompanyEntity } from '../../company/entities/company.entity';
import { Role } from '../../role/entities/role.entity';
import { User } from '../../user/entities/user.entity';

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
    @ManyToOne(() => CompanyEntity, (company) => company.users)
    @JoinColumn()
    company?: Relation<CompanyEntity>;

    @Column({ nullable: true })
    companyId: string;
}
