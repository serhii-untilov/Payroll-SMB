import { MigrationInterface, QueryRunner } from 'typeorm';

export class Gen1724978491999 implements MigrationInterface {
    name = 'Gen1724978491999';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE INDEX "IDX_POSITION_BALANCE_POSITION_PERIOD" ON "position_balance" ("positionId", "payPeriod")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX "public"."IDX_POSITION_BALANCE_POSITION_PERIOD"
        `);
    }
}
