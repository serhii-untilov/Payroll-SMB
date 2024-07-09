import { Logger } from './../../../resources/abstract/logger.abstract';
import { IJob } from '@repo/shared';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Job extends Logger implements IJob {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'varchar', length: 50 })
    name: string;
}
