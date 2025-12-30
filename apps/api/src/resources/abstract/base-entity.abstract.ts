import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    UpdateDateColumn,
    VersionColumn,
} from 'typeorm';
import { SnowflakeBase } from './snowflake.abstract';

export abstract class BaseEntity extends SnowflakeBase {
    @CreateDateColumn()
    createdDate: Date;

    @Column({ type: 'bigint', nullable: true })
    createdUserId?: string | null;

    @UpdateDateColumn()
    updatedDate: Date;

    @Column({ type: 'bigint', nullable: true })
    updatedUserId?: string | null;

    @DeleteDateColumn({ nullable: true })
    deletedDate?: Date | null;

    @Column({ type: 'bigint', nullable: true })
    deletedUserId?: string | null;

    @VersionColumn({ default: 1 })
    version: number;
}
