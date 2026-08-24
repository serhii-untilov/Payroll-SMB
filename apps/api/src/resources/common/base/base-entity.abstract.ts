import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, CreateDateColumn, DeleteDateColumn, UpdateDateColumn, VersionColumn } from 'typeorm';
import { SnowflakeBase } from './snowflake.abstract';

export abstract class BaseEntity extends SnowflakeBase {
    @ApiProperty({ type: Date })
    @CreateDateColumn()
    createdDate: Date;

    @ApiPropertyOptional({ type: String, nullable: true })
    @Column({ type: 'bigint', nullable: true })
    createdUserId?: string | null;

    @ApiProperty({ type: Date })
    @UpdateDateColumn()
    updatedDate: Date;

    @ApiPropertyOptional({ type: String, nullable: true })
    @Column({ type: 'bigint', nullable: true })
    updatedUserId?: string | null;

    @ApiPropertyOptional({ type: Date, nullable: true })
    @DeleteDateColumn({ nullable: true })
    deletedDate?: Date | null;

    @ApiPropertyOptional({ type: String, nullable: true })
    @Column({ type: 'bigint', nullable: true })
    deletedUserId?: string | null;

    @ApiProperty({ type: Number })
    @VersionColumn({ default: 1 })
    version: number;
}
