import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../abstract/base-entity.abstract';

@Entity()
export class Job extends BaseEntity {
    @Column({ type: 'varchar', length: 50 })
    name: string;
}
