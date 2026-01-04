import { IdGenerator } from '@/snowflake/snowflake.singleton';
import { PrimaryColumn, BeforeInsert } from 'typeorm';

export abstract class SnowflakeBase {
    @PrimaryColumn('bigint')
    id: string;

    @BeforeInsert()
    generateId() {
        if (!this.id) this.id = IdGenerator.nextId();
    }
}
