import {
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
    createdUser: User;

    @UpdateDateColumn()
    updatedDate: Date;

    @ManyToOne(() => User, {
        createForeignKeyConstraints: false,
    })
    updatedUser: User;

    @DeleteDateColumn()
    deletedDate: Date;

    @ManyToOne(() => User, {
        createForeignKeyConstraints: false,
        nullable: true,
    })
    deletedUser?: User;

    @VersionColumn()
    version: number;
}
