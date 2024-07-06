import { MigrationInterface, QueryRunner } from 'typeorm';

export class Gen1720231988905 implements MigrationInterface {
    name = 'Gen1720231988905';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "payroll"
            ALTER COLUMN "recordFlags" DROP DEFAULT
        `);
        await queryRunner.query(`
            ALTER TABLE "pay_fund_type"
            ALTER COLUMN "description"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "pay_fund_type"
            ALTER COLUMN "description"
            SET DEFAULT ''
        `);
        await queryRunner.query(`
            ALTER TABLE "payment_position"
            ADD CONSTRAINT "FK_8647e3e404d9bfe4126a4f51308" FOREIGN KEY ("paymentId") REFERENCES "payment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "payment_position" DROP CONSTRAINT "FK_8647e3e404d9bfe4126a4f51308"
        `);
        await queryRunner.query(`
            ALTER TABLE "pay_fund_type"
            ALTER COLUMN "description" DROP DEFAULT
        `);
        await queryRunner.query(`
            ALTER TABLE "pay_fund_type"
            ALTER COLUMN "description" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "payroll"
            ALTER COLUMN "recordFlags"
            SET DEFAULT '0'
        `);
    }
}
