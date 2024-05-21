import { MigrationInterface, QueryRunner } from 'typeorm';

export class Gen1716205533169 implements MigrationInterface {
    name = 'Gen1716205533169';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "pay_period_calc_method" (
                "id" SERIAL NOT NULL,
                "payPeriodId" integer NOT NULL,
                "calcMethod" character varying(30) NOT NULL,
                "factSum" numeric(15, 2) NOT NULL DEFAULT '0',
                CONSTRAINT "PK_17136ecb41b86ba0c1a8fb5d496" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "pay_period"
            ADD "basic" numeric(15, 2) NOT NULL DEFAULT '0'
        `);
        await queryRunner.query(`
            ALTER TABLE "pay_period"
            ADD "adjustments" numeric(15, 2) NOT NULL DEFAULT '0'
        `);
        await queryRunner.query(`
            ALTER TABLE "pay_period"
            ADD "bonuses" numeric(15, 2) NOT NULL DEFAULT '0'
        `);
        await queryRunner.query(`
            ALTER TABLE "pay_period"
            ADD "vacations" numeric(15, 2) NOT NULL DEFAULT '0'
        `);
        await queryRunner.query(`
            ALTER TABLE "pay_period"
            ADD "sicks" numeric(15, 2) NOT NULL DEFAULT '0'
        `);
        await queryRunner.query(`
            ALTER TABLE "pay_period"
            ADD "refunds" numeric(15, 2) NOT NULL DEFAULT '0'
        `);
        await queryRunner.query(`
            ALTER TABLE "pay_period"
            ADD "other_accruals" numeric(15, 2) NOT NULL DEFAULT '0'
        `);
        await queryRunner.query(`
            ALTER TABLE "pay_period"
            ADD "taxes" numeric(15, 2) NOT NULL DEFAULT '0'
        `);
        await queryRunner.query(`
            ALTER TABLE "pay_period"
            ADD "payments" numeric(15, 2) NOT NULL DEFAULT '0'
        `);
        await queryRunner.query(`
            ALTER TABLE "pay_period"
            ADD "other_deductions" numeric(15, 2) NOT NULL DEFAULT '0'
        `);
        await queryRunner.query(`
            ALTER TABLE "pay_period_calc_method"
            ADD CONSTRAINT "FK_84d128a0583032d2dab694f1216" FOREIGN KEY ("payPeriodId") REFERENCES "pay_period"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "pay_period_calc_method" DROP CONSTRAINT "FK_84d128a0583032d2dab694f1216"
        `);
        await queryRunner.query(`
            ALTER TABLE "pay_period" DROP COLUMN "other_deductions"
        `);
        await queryRunner.query(`
            ALTER TABLE "pay_period" DROP COLUMN "payments"
        `);
        await queryRunner.query(`
            ALTER TABLE "pay_period" DROP COLUMN "taxes"
        `);
        await queryRunner.query(`
            ALTER TABLE "pay_period" DROP COLUMN "other_accruals"
        `);
        await queryRunner.query(`
            ALTER TABLE "pay_period" DROP COLUMN "refunds"
        `);
        await queryRunner.query(`
            ALTER TABLE "pay_period" DROP COLUMN "sicks"
        `);
        await queryRunner.query(`
            ALTER TABLE "pay_period" DROP COLUMN "vacations"
        `);
        await queryRunner.query(`
            ALTER TABLE "pay_period" DROP COLUMN "bonuses"
        `);
        await queryRunner.query(`
            ALTER TABLE "pay_period" DROP COLUMN "adjustments"
        `);
        await queryRunner.query(`
            ALTER TABLE "pay_period" DROP COLUMN "basic"
        `);
        await queryRunner.query(`
            DROP TABLE "pay_period_calc_method"
        `);
    }
}
