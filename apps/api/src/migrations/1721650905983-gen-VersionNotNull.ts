import { MigrationInterface, QueryRunner } from 'typeorm';

export class Gen1721650905983 implements MigrationInterface {
    name = 'Gen1721650905983';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "work_norm_period"
            ALTER COLUMN "version"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "work_norm"
            ALTER COLUMN "version"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "user"
            ALTER COLUMN "version"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "accounting"
            ALTER COLUMN "version"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "department"
            ALTER COLUMN "version"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "person"
            ALTER COLUMN "version"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "payment_type"
            ALTER COLUMN "version"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "payment_type"
            ALTER COLUMN "description"
            SET DEFAULT ''
        `);
        await queryRunner.query(`
            ALTER TABLE "job"
            ALTER COLUMN "version"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "position_history"
            ALTER COLUMN "version"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "position"
            ALTER COLUMN "version"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "company"
            ALTER COLUMN "version"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "user_company"
            ALTER COLUMN "version"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "task"
            ALTER COLUMN "version"
            SET NOT NULL
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_PAYROLL_SOURCE_TYPE_ID"
        `);
        await queryRunner.query(`
            ALTER TABLE "payroll"
            ALTER COLUMN "version"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "payroll"
            ALTER COLUMN "sourceType"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "payroll"
            ALTER COLUMN "sourceType"
            SET DEFAULT ''
        `);
        await queryRunner.query(`
            ALTER TABLE "payment_position"
            ALTER COLUMN "version"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "payment"
            ALTER COLUMN "version"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "pay_fund_type"
            ALTER COLUMN "version"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "pay_period"
            ALTER COLUMN "version"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "min_wage"
            ALTER COLUMN "version"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "access"
            ALTER COLUMN "version"
            SET NOT NULL
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_PAYROLL_SOURCE_TYPE_ID" ON "payroll" ("sourceType", "sourceId")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX "public"."IDX_PAYROLL_SOURCE_TYPE_ID"
        `);
        await queryRunner.query(`
            ALTER TABLE "access"
            ALTER COLUMN "version" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "min_wage"
            ALTER COLUMN "version" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "pay_period"
            ALTER COLUMN "version" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "pay_fund_type"
            ALTER COLUMN "version" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "payment"
            ALTER COLUMN "version" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "payment_position"
            ALTER COLUMN "version" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "payroll"
            ALTER COLUMN "sourceType" DROP DEFAULT
        `);
        await queryRunner.query(`
            ALTER TABLE "payroll"
            ALTER COLUMN "sourceType" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "payroll"
            ALTER COLUMN "version" DROP NOT NULL
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_PAYROLL_SOURCE_TYPE_ID" ON "payroll" ("sourceType", "sourceId")
        `);
        await queryRunner.query(`
            ALTER TABLE "task"
            ALTER COLUMN "version" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "user_company"
            ALTER COLUMN "version" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "company"
            ALTER COLUMN "version" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "position"
            ALTER COLUMN "version" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "position_history"
            ALTER COLUMN "version" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "job"
            ALTER COLUMN "version" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "payment_type"
            ALTER COLUMN "description" DROP DEFAULT
        `);
        await queryRunner.query(`
            ALTER TABLE "payment_type"
            ALTER COLUMN "version" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "person"
            ALTER COLUMN "version" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "department"
            ALTER COLUMN "version" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "accounting"
            ALTER COLUMN "version" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "user"
            ALTER COLUMN "version" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "work_norm"
            ALTER COLUMN "version" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "work_norm_period"
            ALTER COLUMN "version" DROP NOT NULL
        `);
    }
}
