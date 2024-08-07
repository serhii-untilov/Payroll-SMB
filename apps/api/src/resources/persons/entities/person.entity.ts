import { Sex } from './../../../types/lib/Sex';
import { Position } from './../../positions/entities/position.entity';
import { Logger } from './../../abstract/logger.abstract';
import {
    AfterInsert,
    AfterLoad,
    AfterUpdate,
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { getFullName } from '@repo/shared';
import { ApiProperty } from '@nestjs/swagger';

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

    @Column({ type: 'varchar', length: 10, default: '', nullable: true })
    @ApiProperty({ enum: Sex, enumName: 'Sex', nullable: true })
    sex: Sex | null;

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
