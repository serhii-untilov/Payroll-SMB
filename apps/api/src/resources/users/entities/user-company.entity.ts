import { IRole, IUserCompany } from '@repo/shared';
import { Company } from '../../companies/entities/company.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
import { Logger } from '../../../resources/abstract/logger.abstract';
import { User } from './user.entity';

@Entity()
export class UserCompany extends Logger implements IUserCompany {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(() => User, { createForeignKeyConstraints: false })
    user?: User;

    @Column()
    userId: number;

    // @ManyToOne(() => Company, { createForeignKeyConstraints: false })
    @ManyToOne(() => Company, (company) => company.users)
    @JoinColumn()
    company?: Company;

    @Column()
    companyId: number;

    @ManyToOne(() => Role, { createForeignKeyConstraints: false })
    role?: IRole;

    @Column()
    roleId: number;
}
