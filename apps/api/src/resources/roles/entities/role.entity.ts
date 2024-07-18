import { ApiProperty } from '@nestjs/swagger';
import { RoleType } from '@/types';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Role {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'varchar', length: 50 })
    name: string;

    @Column({ type: 'varchar', length: 15, default: RoleType.GUEST })
    @ApiProperty({ enum: RoleType })
    type: RoleType;

    // @ManyToMany(() => User, (user) => user.roles)
    // users?: User[];
}
