import { ILogger } from '@repo/shared/src/interfaces/logger.interface';
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
    createdUserId?: number;

    @UpdateDateColumn()
    updatedDate?: Date;

    @Column({ type: 'integer', nullable: true })
    updatedUserId?: number;

    @DeleteDateColumn({ default: '9999-12-31' })
    deletedDate?: Date;

    @Column({ type: 'integer', nullable: true })
    deletedUserId?: number;

    @VersionColumn()
    version?: number;
}
