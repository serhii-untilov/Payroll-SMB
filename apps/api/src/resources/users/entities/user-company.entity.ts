import { IRole, IUserCompany } from '@repo/shared';
import { Company } from '../../companies/entities/company.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../../roles/entities/role.entity';

@Entity()
export class UserCompany implements IUserCompany {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    userId: number;

    @ManyToOne(() => Company, {
        createForeignKeyConstraints: false,
    })
    company?: Company;

    @Column()
    companyId: number;

    @ManyToOne(() => Role, { createForeignKeyConstraints: false })
    role?: IRole;

    @Column()
    roleId: number;
}
