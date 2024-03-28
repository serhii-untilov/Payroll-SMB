import { MigrationInterface, QueryRunner } from 'typeorm';

export class Gen1711608772986 implements MigrationInterface {
    name = 'Gen1711608772986';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "temporary_company" (
                "createdDate" datetime NOT NULL DEFAULT (datetime('now')),
                "createdUserId" integer NOT NULL,
                "updatedDate" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedUserId" integer NOT NULL,
                "deletedDate" datetime,
                "deletedUserId" integer,
                "version" integer NOT NULL,
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "name" varchar(50) NOT NULL,
                "taxId" varchar(15) NOT NULL DEFAULT (''),
                "lawId" integer,
                "accountingId" integer,
                "dateFrom" date NOT NULL DEFAULT ('1900-01-01'),
                "dateTo" date NOT NULL DEFAULT ('9999-12-31'),
                "payPeriod" date NOT NULL DEFAULT ('1900-01-01'),
                "checkDate" date NOT NULL DEFAULT ('1900-01-01'),
                "paymentSchedule" varchar(10) NOT NULL DEFAULT ('last-day')
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_company"(
                    "createdDate",
                    "createdUserId",
                    "updatedDate",
                    "updatedUserId",
                    "deletedDate",
                    "deletedUserId",
                    "version",
                    "id",
                    "name",
                    "taxId",
                    "lawId",
                    "accountingId",
                    "dateFrom",
                    "dateTo",
                    "payPeriod",
                    "checkDate"
                )
            SELECT "createdDate",
                "createdUserId",
                "updatedDate",
                "updatedUserId",
                "deletedDate",
                "deletedUserId",
                "version",
                "id",
                "name",
                "taxId",
                "lawId",
                "accountingId",
                "dateFrom",
                "dateTo",
                "payPeriod",
                "checkDate"
            FROM "company"
        `);
        await queryRunner.query(`
            DROP TABLE "company"
        `);
        await queryRunner.query(`
            ALTER TABLE "temporary_company"
                RENAME TO "company"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "company"
                RENAME TO "temporary_company"
        `);
        await queryRunner.query(`
            CREATE TABLE "company" (
                "createdDate" datetime NOT NULL DEFAULT (datetime('now')),
                "createdUserId" integer NOT NULL,
                "updatedDate" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedUserId" integer NOT NULL,
                "deletedDate" datetime,
                "deletedUserId" integer,
                "version" integer NOT NULL,
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "name" varchar(50) NOT NULL,
                "taxId" varchar(15) NOT NULL DEFAULT (''),
                "lawId" integer,
                "accountingId" integer,
                "dateFrom" date NOT NULL DEFAULT ('1900-01-01'),
                "dateTo" date NOT NULL DEFAULT ('9999-12-31'),
                "payPeriod" date NOT NULL DEFAULT ('1900-01-01'),
                "checkDate" date NOT NULL DEFAULT ('1900-01-01')
            )
        `);
        await queryRunner.query(`
            INSERT INTO "company"(
                    "createdDate",
                    "createdUserId",
                    "updatedDate",
                    "updatedUserId",
                    "deletedDate",
                    "deletedUserId",
                    "version",
                    "id",
                    "name",
                    "taxId",
                    "lawId",
                    "accountingId",
                    "dateFrom",
                    "dateTo",
                    "payPeriod",
                    "checkDate"
                )
            SELECT "createdDate",
                "createdUserId",
                "updatedDate",
                "updatedUserId",
                "deletedDate",
                "deletedUserId",
                "version",
                "id",
                "name",
                "taxId",
                "lawId",
                "accountingId",
                "dateFrom",
                "dateTo",
                "payPeriod",
                "checkDate"
            FROM "temporary_company"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_company"
        `);
    }
}
