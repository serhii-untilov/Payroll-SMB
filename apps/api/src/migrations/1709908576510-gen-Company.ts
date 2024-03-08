import { MigrationInterface, QueryRunner } from 'typeorm';

export class Gen1709908576510 implements MigrationInterface {
    name = 'Gen1709908576510';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "temporary_company" (
                "createdDate" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedDate" datetime NOT NULL DEFAULT (datetime('now')),
                "deletedDate" datetime DEFAULT ('9999-12-31'),
                "version" integer NOT NULL,
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "name" varchar(50) NOT NULL,
                "taxId" varchar(15) NOT NULL DEFAULT (''),
                "dateFrom" date NOT NULL DEFAULT ('1970-01-01'),
                "dateTo" date NOT NULL DEFAULT ('9999-12-31'),
                "payPeriod" date NOT NULL DEFAULT ('1970-01-01'),
                "checkDate" date NOT NULL DEFAULT ('1970-01-01'),
                "createdUserId" integer,
                "updatedUserId" integer,
                "deletedUserId" integer,
                "lawId" integer,
                "accountingId" integer,
                "ownerId" integer
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_company"(
                    "createdDate",
                    "updatedDate",
                    "deletedDate",
                    "version",
                    "id",
                    "name",
                    "taxId",
                    "dateFrom",
                    "dateTo",
                    "payPeriod",
                    "checkDate",
                    "createdUserId",
                    "updatedUserId",
                    "deletedUserId",
                    "lawId",
                    "accountingId",
                    "ownerId"
                )
            SELECT "createdDate",
                "updatedDate",
                "deletedDate",
                "version",
                "id",
                "name",
                "taxId",
                "dateFrom",
                "dateTo",
                "payPeriod",
                "checkDate",
                "createdUserId",
                "updatedUserId",
                "deletedUserId",
                "lawId",
                "accountingId",
                "ownerId"
            FROM "company"
        `);
        await queryRunner.query(`
            DROP TABLE "company"
        `);
        await queryRunner.query(`
            ALTER TABLE "temporary_company"
                RENAME TO "company"
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
            CREATE TABLE "temporary_company" (
                "createdDate" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedDate" datetime NOT NULL DEFAULT (datetime('now')),
                "deletedDate" datetime DEFAULT ('9999-12-31'),
                "version" integer NOT NULL,
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "name" varchar(50) NOT NULL,
                "taxId" varchar(15) NOT NULL DEFAULT (''),
                "dateFrom" date NOT NULL DEFAULT ('1970-01-01'),
                "dateTo" date NOT NULL DEFAULT ('9999-12-31'),
                "payPeriod" date NOT NULL DEFAULT ('1970-01-01'),
                "checkDate" date NOT NULL DEFAULT ('1970-01-01'),
                "createdUserId" integer,
                "updatedUserId" integer,
                "deletedUserId" integer,
                "lawId" integer,
                "accountingId" integer
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_company"(
                    "createdDate",
                    "updatedDate",
                    "deletedDate",
                    "version",
                    "id",
                    "name",
                    "taxId",
                    "dateFrom",
                    "dateTo",
                    "payPeriod",
                    "checkDate",
                    "createdUserId",
                    "updatedUserId",
                    "deletedUserId",
                    "lawId",
                    "accountingId"
                )
            SELECT "createdDate",
                "updatedDate",
                "deletedDate",
                "version",
                "id",
                "name",
                "taxId",
                "dateFrom",
                "dateTo",
                "payPeriod",
                "checkDate",
                "createdUserId",
                "updatedUserId",
                "deletedUserId",
                "lawId",
                "accountingId"
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
                "updatedDate" datetime NOT NULL DEFAULT (datetime('now')),
                "deletedDate" datetime DEFAULT ('9999-12-31'),
                "version" integer NOT NULL,
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "name" varchar(50) NOT NULL,
                "taxId" varchar(15) NOT NULL DEFAULT (''),
                "dateFrom" date NOT NULL DEFAULT ('1970-01-01'),
                "dateTo" date NOT NULL DEFAULT ('9999-12-31'),
                "payPeriod" date NOT NULL DEFAULT ('1970-01-01'),
                "checkDate" date NOT NULL DEFAULT ('1970-01-01'),
                "createdUserId" integer,
                "updatedUserId" integer,
                "deletedUserId" integer,
                "lawId" integer,
                "accountingId" integer,
                "ownerId" integer
            )
        `);
        await queryRunner.query(`
            INSERT INTO "company"(
                    "createdDate",
                    "updatedDate",
                    "deletedDate",
                    "version",
                    "id",
                    "name",
                    "taxId",
                    "dateFrom",
                    "dateTo",
                    "payPeriod",
                    "checkDate",
                    "createdUserId",
                    "updatedUserId",
                    "deletedUserId",
                    "lawId",
                    "accountingId"
                )
            SELECT "createdDate",
                "updatedDate",
                "deletedDate",
                "version",
                "id",
                "name",
                "taxId",
                "dateFrom",
                "dateTo",
                "payPeriod",
                "checkDate",
                "createdUserId",
                "updatedUserId",
                "deletedUserId",
                "lawId",
                "accountingId"
            FROM "temporary_company"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_company"
        `);
        await queryRunner.query(`
            DROP TABLE "user_company"
        `);
        await queryRunner.query(`
            ALTER TABLE "company"
                RENAME TO "temporary_company"
        `);
        await queryRunner.query(`
            CREATE TABLE "company" (
                "createdDate" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedDate" datetime NOT NULL DEFAULT (datetime('now')),
                "deletedDate" datetime DEFAULT ('9999-12-31'),
                "version" integer NOT NULL,
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "name" varchar(50) NOT NULL,
                "taxId" varchar(15) NOT NULL DEFAULT (''),
                "dateFrom" date NOT NULL DEFAULT ('1970-01-01'),
                "dateTo" date NOT NULL DEFAULT ('9999-12-31'),
                "payPeriod" date NOT NULL DEFAULT ('1970-01-01'),
                "checkDate" date NOT NULL DEFAULT ('1970-01-01'),
                "createdUserId" integer,
                "updatedUserId" integer,
                "deletedUserId" integer,
                "lawId" integer,
                "accountingId" integer,
                "ownerId" integer,
                CONSTRAINT "FK_ee87438803acb531639e8284be0" FOREIGN KEY ("ownerId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            )
        `);
        await queryRunner.query(`
            INSERT INTO "company"(
                    "createdDate",
                    "updatedDate",
                    "deletedDate",
                    "version",
                    "id",
                    "name",
                    "taxId",
                    "dateFrom",
                    "dateTo",
                    "payPeriod",
                    "checkDate",
                    "createdUserId",
                    "updatedUserId",
                    "deletedUserId",
                    "lawId",
                    "accountingId",
                    "ownerId"
                )
            SELECT "createdDate",
                "updatedDate",
                "deletedDate",
                "version",
                "id",
                "name",
                "taxId",
                "dateFrom",
                "dateTo",
                "payPeriod",
                "checkDate",
                "createdUserId",
                "updatedUserId",
                "deletedUserId",
                "lawId",
                "accountingId",
                "ownerId"
            FROM "temporary_company"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_company"
        `);
    }
}
