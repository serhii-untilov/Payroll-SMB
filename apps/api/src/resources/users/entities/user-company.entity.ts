import { Company } from '../../companies/entities/company.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
import { Logger } from './../../../resources/abstract/logger.abstract';
import { User } from './user.entity';

@Entity()
export class UserCompany extends Logger {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(() => User, { createForeignKeyConstraints: false })
    user?: Relation<User>;

    @Column()
    userId: number;

    // @ManyToOne(() => Company, { createForeignKeyConstraints: false })
    @ManyToOne(() => Company, (company) => company.users)
    @JoinColumn()
    company?: Relation<Company>;

    @Column()
    companyId: number;

    @ManyToOne(() => Role, { createForeignKeyConstraints: false })
    role?: Relation<Role>;

    @Column()
    roleId: number;
}
