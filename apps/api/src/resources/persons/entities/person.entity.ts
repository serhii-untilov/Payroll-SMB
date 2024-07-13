import { Logger } from './../../../resources/abstract/logger.abstract';
import { Position } from './../../../resources/positions/entities/position.entity';
import { getFullName } from '@repo/shared';
import {
    AfterInsert,
    AfterLoad,
    AfterUpdate,
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Person extends Logger {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'varchar', length: 30 })
    firstName: string;

    @Column({ type: 'varchar', length: 30 })
    lastName: string;

    @Column({ type: 'varchar', length: 30, default: '' })
    middleName: string;

    fullName: string;

    @Column({ type: 'date', nullable: true })
    birthday: Date | null;

    @Column({ type: 'varchar', length: 15, default: '' })
    taxId: string;

    @Column({ type: 'varchar', length: 10, default: '' })
    sex: string;

    @Column({ type: 'varchar', length: 20, default: '' })
    phone: string;

    @Column({ type: 'varchar', length: 50, default: '' })
    email: string;

    @Column({ type: 'varchar', length: 260, default: '' })
    photo: string;

    @OneToMany(() => Position, (position) => position.person)
    positions?: Position[];

    @AfterLoad()
    @AfterInsert()
    @AfterUpdate()
    transform() {
        this.fullName = getFullName(this.lastName, this.firstName, this.middleName);
    }
}
