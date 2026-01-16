import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../common/base/base-entity.abstract';

@Entity()
export class JobEntity extends BaseEntity {
    @Column({ type: 'varchar', length: 50 })
    name: string;
}
