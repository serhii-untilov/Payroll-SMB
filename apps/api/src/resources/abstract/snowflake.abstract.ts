import { PrimaryColumn, BeforeInsert } from 'typeorm';
import { SnowflakeServiceSingleton } from '../../snowflake/snowflake.singleton';

export abstract class SnowflakeBase {
    @PrimaryColumn('bigint')
    id: string;

    @BeforeInsert()
    generateId() {
        if (!this.id) this.id = SnowflakeServiceSingleton.nextId();
    }
}
