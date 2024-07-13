import { RoleType } from '@repo/shared';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Role {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'varchar', length: 50 })
    name: string;

    @Column({ type: 'varchar', length: 15, default: RoleType.GUEST })
    type: string;

    // @ManyToMany(() => User, (user) => user.roles)
    // users?: User[];
}
