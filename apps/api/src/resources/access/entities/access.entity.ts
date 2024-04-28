import { IAccess } from '@repo/shared';
import { Logger } from '../../../resources/abstract/logger.abstract';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Access extends Logger implements IAccess {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'varchar', length: 20 })
    roleType: string; // See enum RoleType

    @Column({ type: 'varchar', length: 20 })
    resourceType: string; // See enum ResourceType

    @Column({ type: 'varchar', length: 20 })
    accessType: string; // See enum AccessType
}
