import { MigrationInterface, QueryRunner } from 'typeorm';

export class Gen1713971349938 implements MigrationInterface {
    name = 'Gen1713971349938';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "position" DROP COLUMN "firstName"
        `);
        await queryRunner.query(`
            ALTER TABLE "work_norm"
            ALTER COLUMN "type"
            SET DEFAULT 'weekly'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "work_norm"
            ALTER COLUMN "type" DROP DEFAULT
        `);
        await queryRunner.query(`
            ALTER TABLE "position"
            ADD "firstName" character varying(30) NOT NULL
        `);
    }
}
