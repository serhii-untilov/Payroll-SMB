/* eslint-disable max-len */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class Gen1712066282628 implements MigrationInterface {
    name = 'Gen1712066282628';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "password"
        `);
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD "password" character varying(60) NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "password"
        `);
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD "password" character varying(50) NOT NULL
        `);
    }
}
