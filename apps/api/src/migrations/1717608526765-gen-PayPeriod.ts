import { MigrationInterface, QueryRunner } from 'typeorm';

export class Gen1717608526765 implements MigrationInterface {
    name = 'Gen1717608526765';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "pay_period"
            ADD "funds" numeric(15, 2) NOT NULL DEFAULT '0'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "pay_period" DROP COLUMN "funds"
        `);
    }
}
