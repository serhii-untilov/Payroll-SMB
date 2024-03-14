import { ILogger } from '@repo/shared';
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    UpdateDateColumn,
    VersionColumn,
} from 'typeorm';

export abstract class Logger implements ILogger {
    @CreateDateColumn()
    createdDate?: Date;

    @Column({ type: 'integer' })
    createdUserId?: number;

    @UpdateDateColumn()
    updatedDate?: Date;

    @Column({ type: 'integer' })
    updatedUserId?: number;

    @DeleteDateColumn({ nullable: true })
    deletedDate?: Date | null;

    @Column({ type: 'integer', nullable: true })
    deletedUserId?: number;

    @VersionColumn()
    version?: number;
}
