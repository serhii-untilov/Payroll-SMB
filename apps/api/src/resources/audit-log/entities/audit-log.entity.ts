import { IdGenerator } from '@/snowflake/snowflake.singleton';
import { AuditAction } from '@/types';
import { ApiProperty } from '@nestjs/swagger';
import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('audit_logs')
export class AuditLogEntity {
    @PrimaryColumn('bigint')
    id: string;

    @Column()
    aggregateType: string;

    @Column()
    aggregateId: string;

    @Column({ type: 'enum', enum: AuditAction })
    @ApiProperty({ enum: AuditAction, enumName: 'AuditAction', nullable: true })
    action: AuditAction;

    @Column('jsonb', { nullable: true })
    diff?: Record<string, { before: unknown; after: unknown }>;

    @Column()
    userId: string;

    @Column()
    occurredAt: Date;

    @BeforeInsert()
    generateId() {
        if (!this.id) this.id = IdGenerator.nextId();
    }
}
