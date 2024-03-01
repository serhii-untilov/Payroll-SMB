import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    UpdateDateColumn,
    VersionColumn,
} from 'typeorm';
import { User } from '../users/entities/user.entity';

export abstract class Logger {
    @CreateDateColumn()
    createdDate: Date;

    @ManyToOne(() => User, {
        createForeignKeyConstraints: false,
    })
    createdUser?: User;

    @Column({ type: 'integer', nullable: true })
    createdUserId: number;

    @UpdateDateColumn()
    updatedDate: Date;

    @ManyToOne(() => User, {
        createForeignKeyConstraints: false,
    })
    updatedUser?: User;

    @Column({ type: 'integer', nullable: true })
    updatedUserId: number;

    @DeleteDateColumn()
    deletedDate: Date;

    @ManyToOne(() => User, {
        createForeignKeyConstraints: false,
        nullable: true,
    })
    deletedUser?: User;

    @Column({ type: 'integer', nullable: true })
    deletedUserId?: number;

    @VersionColumn()
    version: number;
}
