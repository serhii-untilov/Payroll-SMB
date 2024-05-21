import { MigrationInterface, QueryRunner } from "typeorm";

export class Gen1716292067809 implements MigrationInterface {
    name = 'Gen1716292067809'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "position_balance"
            ADD "planDays" integer NOT NULL DEFAULT '0'
        `);
        await queryRunner.query(`
            ALTER TABLE "position_balance"
            ADD "planHours" numeric(15, 2) NOT NULL DEFAULT '0'
        `);
        await queryRunner.query(`
            ALTER TABLE "position_balance"
            ADD "factDays" integer NOT NULL DEFAULT '0'
        `);
        await queryRunner.query(`
            ALTER TABLE "position_balance"
            ADD "factHours" numeric(15, 2) NOT NULL DEFAULT '0'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "position_balance" DROP COLUMN "factHours"
        `);
        await queryRunner.query(`
            ALTER TABLE "position_balance" DROP COLUMN "factDays"
        `);
        await queryRunner.query(`
            ALTER TABLE "position_balance" DROP COLUMN "planHours"
        `);
        await queryRunner.query(`
            ALTER TABLE "position_balance" DROP COLUMN "planDays"
        `);
    }

}
