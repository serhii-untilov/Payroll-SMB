import { Gender } from '@/types';
import { ApiProperty } from '@nestjs/swagger';
import { AfterInsert, AfterLoad, AfterUpdate, Column, Entity, Index, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/base/base-entity.abstract';
import { Position } from '../../positions/entities/position.entity';
import { PersonMapper } from '../mappers/person.mapper';

@Entity()
export class PersonEntity extends BaseEntity {
    @Column({ type: 'varchar', length: 30 })
    firstName: string;

    @Column({ type: 'varchar', length: 30 })
    lastName: string;

    @Column({ type: 'varchar', length: 30, nullable: true })
    middleName: string | null;

    fullName: string;

    @Column({ type: 'date', nullable: true })
    birthDate: Date | null;

    @Column({ type: 'enum', enum: Gender, nullable: true })
    @ApiProperty({ enum: Gender, enumName: 'Gender', nullable: true })
    gender: Gender | null;

    @Index({ unique: true })
    @Column({ type: 'varchar', length: 15, nullable: true })
    taxId: string | null;

    @Column({ type: 'varchar', length: 20, nullable: true })
    phone: string | null;

    @Index({ unique: true })
    @Column({ type: 'varchar', length: 50, nullable: true })
    email: string | null;

    @Column({ type: 'varchar', length: 260, nullable: true })
    photo: string | null;

    @OneToMany(() => Position, (position) => position.person)
    positions?: Position[];

    @AfterLoad()
    @AfterInsert()
    @AfterUpdate()
    transform() {
        this.fullName = PersonMapper.buildFullName(this.lastName, this.firstName, this.middleName);
    }
}
