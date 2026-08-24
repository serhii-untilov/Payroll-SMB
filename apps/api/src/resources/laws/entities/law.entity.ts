import { ApiProperty } from '@nestjs/swagger';
import { LawType } from './../../../types';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Law {
    @ApiProperty({ type: String })
    @PrimaryGeneratedColumn('identity')
    id: string;

    @Column({ type: 'varchar', length: 50 })
    name: string;

    @Column({
        type: 'varchar',
        length: 15,
        default: LawType.Ukraine,
    })
    @ApiProperty({ enum: LawType, enumName: 'LawType' })
    type: string;
}
