import { MigrationInterface, QueryRunner } from 'typeorm';

export class Gen1716272747857 implements MigrationInterface {
    name = 'Gen1716272747857';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "position_balance"
            ADD "basic" numeric(15, 2) NOT NULL DEFAULT '0'
        `);
        await queryRunner.query(`
            ALTER TABLE "position_balance"
            ADD "adjustments" numeric(15, 2) NOT NULL DEFAULT '0'
        `);
        await queryRunner.query(`
            ALTER TABLE "position_balance"
            ADD "bonuses" numeric(15, 2) NOT NULL DEFAULT '0'
        `);
        await queryRunner.query(`
            ALTER TABLE "position_balance"
            ADD "vacations" numeric(15, 2) NOT NULL DEFAULT '0'
        `);
        await queryRunner.query(`
            ALTER TABLE "position_balance"
            ADD "sicks" numeric(15, 2) NOT NULL DEFAULT '0'
        `);
        await queryRunner.query(`
            ALTER TABLE "position_balance"
            ADD "refunds" numeric(15, 2) NOT NULL DEFAULT '0'
        `);
        await queryRunner.query(`
            ALTER TABLE "position_balance"
            ADD "other_accruals" numeric(15, 2) NOT NULL DEFAULT '0'
        `);
        await queryRunner.query(`
            ALTER TABLE "position_balance"
            ADD "taxes" numeric(15, 2) NOT NULL DEFAULT '0'
        `);
        await queryRunner.query(`
            ALTER TABLE "position_balance"
            ADD "payments" numeric(15, 2) NOT NULL DEFAULT '0'
        `);
        await queryRunner.query(`
            ALTER TABLE "position_balance"
            ADD "other_deductions" numeric(15, 2) NOT NULL DEFAULT '0'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "position_balance" DROP COLUMN "other_deductions"
        `);
        await queryRunner.query(`
            ALTER TABLE "position_balance" DROP COLUMN "payments"
        `);
        await queryRunner.query(`
            ALTER TABLE "position_balance" DROP COLUMN "taxes"
        `);
        await queryRunner.query(`
            ALTER TABLE "position_balance" DROP COLUMN "other_accruals"
        `);
        await queryRunner.query(`
            ALTER TABLE "position_balance" DROP COLUMN "refunds"
        `);
        await queryRunner.query(`
            ALTER TABLE "position_balance" DROP COLUMN "sicks"
        `);
        await queryRunner.query(`
            ALTER TABLE "position_balance" DROP COLUMN "vacations"
        `);
        await queryRunner.query(`
            ALTER TABLE "position_balance" DROP COLUMN "bonuses"
        `);
        await queryRunner.query(`
            ALTER TABLE "position_balance" DROP COLUMN "adjustments"
        `);
        await queryRunner.query(`
            ALTER TABLE "position_balance" DROP COLUMN "basic"
        `);
    }
}
