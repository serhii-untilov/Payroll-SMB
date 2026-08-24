import { IdGenerator } from '@/snowflake/snowflake.singleton';
import { ApiProperty } from '@nestjs/swagger';
import { PrimaryColumn, BeforeInsert } from 'typeorm';

export abstract class SnowflakeBase {
    @ApiProperty({ type: String })
    @PrimaryColumn('bigint')
    id: string;

    @BeforeInsert()
    generateId() {
        if (!this.id) this.id = IdGenerator.nextId();
    }
}
