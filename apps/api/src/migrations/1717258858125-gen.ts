import { MigrationInterface, QueryRunner } from "typeorm";

export class Gen1717258858125 implements MigrationInterface {
    name = 'Gen1717258858125'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "pay_period" DROP COLUMN "accrual"
        `);
        await queryRunner.query(`
            ALTER TABLE "pay_period" DROP COLUMN "deduction"
        `);
        await queryRunner.query(`
            ALTER TABLE "pay_period" DROP COLUMN "tax"
        `);
        await queryRunner.query(`
            ALTER TABLE "pay_period" DROP COLUMN "netPay"
        `);
        await queryRunner.query(`
            ALTER TABLE "pay_period" DROP COLUMN "payment"
        `);
        await queryRunner.query(`
            ALTER TABLE "pay_period"
            ADD "inCompanyDebt" numeric(15, 2) NOT NULL DEFAULT '0'
        `);
        await queryRunner.query(`
            ALTER TABLE "pay_period"
            ADD "inEmployeeDebt" numeric(15, 2) NOT NULL DEFAULT '0'
        `);
        await queryRunner.query(`
            ALTER TABLE "pay_period"
            ADD "outCompanyDebt" numeric(15, 2) NOT NULL DEFAULT '0'
        `);
        await queryRunner.query(`
            ALTER TABLE "pay_period"
            ADD "outEmployeeDebt" numeric(15, 2) NOT NULL DEFAULT '0'
        `);
        await queryRunner.query(`
            ALTER TABLE "work_norm_period"
            ALTER COLUMN "hours" TYPE numeric(5, 2)
        `);
        await queryRunner.query(`
            ALTER TABLE "payroll"
            ALTER COLUMN "sourceType" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "payroll"
            ALTER COLUMN "sourceId" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "payroll"
            ALTER COLUMN "dateBegin" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "payroll"
            ALTER COLUMN "dateEnd" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "payroll"
            ALTER COLUMN "planHoursByDay" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "payroll"
            ALTER COLUMN "factHoursByDay" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "pay_fund_type"
            ALTER COLUMN "description" DROP NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "pay_fund_type"
            ALTER COLUMN "description"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "payroll"
            ALTER COLUMN "factHoursByDay"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "payroll"
            ALTER COLUMN "planHoursByDay"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "payroll"
            ALTER COLUMN "dateEnd"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "payroll"
            ALTER COLUMN "dateBegin"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "payroll"
            ALTER COLUMN "sourceId"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "payroll"
            ALTER COLUMN "sourceType"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "work_norm_period"
            ALTER COLUMN "hours" TYPE numeric
        `);
        await queryRunner.query(`
            ALTER TABLE "pay_period" DROP COLUMN "outEmployeeDebt"
        `);
        await queryRunner.query(`
            ALTER TABLE "pay_period" DROP COLUMN "outCompanyDebt"
        `);
        await queryRunner.query(`
            ALTER TABLE "pay_period" DROP COLUMN "inEmployeeDebt"
        `);
        await queryRunner.query(`
            ALTER TABLE "pay_period" DROP COLUMN "inCompanyDebt"
        `);
        await queryRunner.query(`
            ALTER TABLE "pay_period"
            ADD "payment" numeric(15, 2) NOT NULL DEFAULT '0'
        `);
        await queryRunner.query(`
            ALTER TABLE "pay_period"
            ADD "netPay" numeric(15, 2) NOT NULL DEFAULT '0'
        `);
        await queryRunner.query(`
            ALTER TABLE "pay_period"
            ADD "tax" numeric(15, 2) NOT NULL DEFAULT '0'
        `);
        await queryRunner.query(`
            ALTER TABLE "pay_period"
            ADD "deduction" numeric(15, 2) NOT NULL DEFAULT '0'
        `);
        await queryRunner.query(`
            ALTER TABLE "pay_period"
            ADD "accrual" numeric(15, 2) NOT NULL DEFAULT '0'
        `);
    }

}
