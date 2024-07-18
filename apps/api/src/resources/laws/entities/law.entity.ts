import { ApiProperty } from '@nestjs/swagger';
import { LawType } from '@/types';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Law {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'varchar', length: 50 })
    name: string;

    @Column({
        type: 'varchar',
        length: 15,
        default: LawType.UKRAINE,
    })
    @ApiProperty({ enum: LawType })
    type: string;
}
