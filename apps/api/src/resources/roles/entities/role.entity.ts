import { IRole, RoleType } from '@repo/shared';
import { User } from '../../users/entities/user.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Role implements IRole {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'varchar', length: 50 })
    name: string;

    @Column({ type: 'varchar', length: 15, default: RoleType.GUEST })
    type: string;

    @ManyToMany(() => User, (user) => user.roles)
    users?: User[];
}
