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

    @Column({ type: 'integer', nullable: true })
    createdUserId?: number | null;

    @UpdateDateColumn()
    updatedDate?: Date;

    @Column({ type: 'integer', nullable: true })
    updatedUserId?: number | null;

    @DeleteDateColumn({ nullable: true })
    deletedDate?: Date | null;

    @Column({ type: 'integer', nullable: true })
    deletedUserId?: number | null;

    @VersionColumn({ default: 1, nullable: true })
    version?: number | null;
}
