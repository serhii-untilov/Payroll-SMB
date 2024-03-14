import { MigrationInterface, QueryRunner } from 'typeorm';

export class Gen1709916550770 implements MigrationInterface {
    name = 'Gen1709916550770';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "temporary_user_company" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "userId" integer NOT NULL,
                "companyId" integer NOT NULL,
                "roleId" integer NOT NULL
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_user_company"("id", "userId", "companyId", "roleId")
            SELECT "id",
                "userId",
                "companyId",
                "roleId"
            FROM "user_company"
        `);
        await queryRunner.query(`
            DROP TABLE "user_company"
        `);
        await queryRunner.query(`
            ALTER TABLE "temporary_user_company"
                RENAME TO "user_company"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user_company"
                RENAME TO "temporary_user_company"
        `);
        await queryRunner.query(`
            CREATE TABLE "user_company" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "userId" integer NOT NULL,
                "companyId" integer NOT NULL,
                "roleId" integer NOT NULL,
                "roleIdId" integer
            )
        `);
        await queryRunner.query(`
            INSERT INTO "user_company"("id", "userId", "companyId", "roleId")
            SELECT "id",
                "userId",
                "companyId",
                "roleId"
            FROM "temporary_user_company"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_user_company"
        `);
    }
}
