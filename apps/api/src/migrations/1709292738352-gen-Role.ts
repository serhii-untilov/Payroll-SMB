import { MigrationInterface, QueryRunner } from 'typeorm';

export class Gen1709292738352 implements MigrationInterface {
    name = 'Gen1709292738352';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "temporary_role" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "name" varchar(50) NOT NULL,
                "type" varchar(15) NOT NULL DEFAULT ('guest')
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_role"("id", "name")
            SELECT "id",
                "name"
            FROM "role"
        `);
        await queryRunner.query(`
            DROP TABLE "role"
        `);
        await queryRunner.query(`
            ALTER TABLE "temporary_role"
                RENAME TO "role"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "role"
                RENAME TO "temporary_role"
        `);
        await queryRunner.query(`
            CREATE TABLE "role" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "name" varchar(50) NOT NULL
            )
        `);
        await queryRunner.query(`
            INSERT INTO "role"("id", "name")
            SELECT "id",
                "name"
            FROM "temporary_role"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_role"
        `);
    }
}
