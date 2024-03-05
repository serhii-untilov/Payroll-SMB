import { MigrationInterface, QueryRunner } from 'typeorm';

export class Gen1709629322277 implements MigrationInterface {
    name = 'Gen1709629322277';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "temporary_company" (
                "createdDate" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedDate" datetime NOT NULL DEFAULT (datetime('now')),
                "deletedDate" datetime,
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
            CREATE TABLE "work_schedule_period" (
                "createdDate" datetime NOT NULL DEFAULT (datetime('now')),
                "createdUserId" integer,
                "updatedDate" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedUserId" integer,
                "deletedDate" datetime DEFAULT ('9999-12-31'),
                "deletedUserId" integer,
                "version" integer NOT NULL,
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "workScheduleId" integer NOT NULL,
                "day" integer NOT NULL,
                "hours" decimal NOT NULL
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "work_schedule" (
                "createdDate" datetime NOT NULL DEFAULT (datetime('now')),
                "createdUserId" integer,
                "updatedDate" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedUserId" integer,
                "deletedDate" datetime DEFAULT ('9999-12-31'),
                "deletedUserId" integer,
                "version" integer NOT NULL,
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "name" varchar(50) NOT NULL,
                "type" varchar(30) NOT NULL,
                "dateFrom" date NOT NULL DEFAULT ('1970-01-01'),
                "dateTo" date NOT NULL DEFAULT ('9999-12-31')
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "department" (
                "createdDate" datetime NOT NULL DEFAULT (datetime('now')),
                "createdUserId" integer,
                "updatedDate" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedUserId" integer,
                "deletedDate" datetime DEFAULT ('9999-12-31'),
                "deletedUserId" integer,
                "version" integer NOT NULL,
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "name" varchar(50) NOT NULL,
                "companyId" integer NOT NULL,
                "dateFrom" date NOT NULL DEFAULT ('1970-01-01'),
                "dateTo" date NOT NULL DEFAULT ('9999-12-31'),
                "parentDepartmentId" integer
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "payment_type" (
                "createdDate" datetime NOT NULL DEFAULT (datetime('now')),
                "createdUserId" integer,
                "updatedDate" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedUserId" integer,
                "deletedDate" datetime DEFAULT ('9999-12-31'),
                "deletedUserId" integer,
                "version" integer NOT NULL,
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "name" varchar(50) NOT NULL,
                "paymentGroup" varchar(30) NOT NULL,
                "paymentMethod" varchar(30) NOT NULL
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "job" (
                "createdDate" datetime NOT NULL DEFAULT (datetime('now')),
                "createdUserId" integer,
                "updatedDate" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedUserId" integer,
                "deletedDate" datetime DEFAULT ('9999-12-31'),
                "deletedUserId" integer,
                "version" integer NOT NULL,
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "name" varchar(50) NOT NULL
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
            CREATE TABLE "temporary_work_schedule_period" (
                "createdDate" datetime NOT NULL DEFAULT (datetime('now')),
                "createdUserId" integer,
                "updatedDate" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedUserId" integer,
                "deletedDate" datetime DEFAULT ('9999-12-31'),
                "deletedUserId" integer,
                "version" integer NOT NULL,
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "workScheduleId" integer NOT NULL,
                "day" integer NOT NULL,
                "hours" decimal NOT NULL,
                CONSTRAINT "FK_3c4b80ca3177a2927f615f480cc" FOREIGN KEY ("workScheduleId") REFERENCES "work_schedule" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_work_schedule_period"(
                    "createdDate",
                    "createdUserId",
                    "updatedDate",
                    "updatedUserId",
                    "deletedDate",
                    "deletedUserId",
                    "version",
                    "id",
                    "workScheduleId",
                    "day",
                    "hours"
                )
            SELECT "createdDate",
                "createdUserId",
                "updatedDate",
                "updatedUserId",
                "deletedDate",
                "deletedUserId",
                "version",
                "id",
                "workScheduleId",
                "day",
                "hours"
            FROM "work_schedule_period"
        `);
        await queryRunner.query(`
            DROP TABLE "work_schedule_period"
        `);
        await queryRunner.query(`
            ALTER TABLE "temporary_work_schedule_period"
                RENAME TO "work_schedule_period"
        `);
        await queryRunner.query(`
            CREATE TABLE "temporary_department" (
                "createdDate" datetime NOT NULL DEFAULT (datetime('now')),
                "createdUserId" integer,
                "updatedDate" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedUserId" integer,
                "deletedDate" datetime DEFAULT ('9999-12-31'),
                "deletedUserId" integer,
                "version" integer NOT NULL,
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "name" varchar(50) NOT NULL,
                "companyId" integer NOT NULL,
                "dateFrom" date NOT NULL DEFAULT ('1970-01-01'),
                "dateTo" date NOT NULL DEFAULT ('9999-12-31'),
                "parentDepartmentId" integer,
                CONSTRAINT "FK_1c9f0159b4ae69008bd356bb1ce" FOREIGN KEY ("companyId") REFERENCES "company" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
                CONSTRAINT "FK_bbe097728367bd569b5db49db90" FOREIGN KEY ("parentDepartmentId") REFERENCES "department" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_department"(
                    "createdDate",
                    "createdUserId",
                    "updatedDate",
                    "updatedUserId",
                    "deletedDate",
                    "deletedUserId",
                    "version",
                    "id",
                    "name",
                    "companyId",
                    "dateFrom",
                    "dateTo",
                    "parentDepartmentId"
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
                "companyId",
                "dateFrom",
                "dateTo",
                "parentDepartmentId"
            FROM "department"
        `);
        await queryRunner.query(`
            DROP TABLE "department"
        `);
        await queryRunner.query(`
            ALTER TABLE "temporary_department"
                RENAME TO "department"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "department"
                RENAME TO "temporary_department"
        `);
        await queryRunner.query(`
            CREATE TABLE "department" (
                "createdDate" datetime NOT NULL DEFAULT (datetime('now')),
                "createdUserId" integer,
                "updatedDate" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedUserId" integer,
                "deletedDate" datetime DEFAULT ('9999-12-31'),
                "deletedUserId" integer,
                "version" integer NOT NULL,
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "name" varchar(50) NOT NULL,
                "companyId" integer NOT NULL,
                "dateFrom" date NOT NULL DEFAULT ('1970-01-01'),
                "dateTo" date NOT NULL DEFAULT ('9999-12-31'),
                "parentDepartmentId" integer
            )
        `);
        await queryRunner.query(`
            INSERT INTO "department"(
                    "createdDate",
                    "createdUserId",
                    "updatedDate",
                    "updatedUserId",
                    "deletedDate",
                    "deletedUserId",
                    "version",
                    "id",
                    "name",
                    "companyId",
                    "dateFrom",
                    "dateTo",
                    "parentDepartmentId"
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
                "companyId",
                "dateFrom",
                "dateTo",
                "parentDepartmentId"
            FROM "temporary_department"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_department"
        `);
        await queryRunner.query(`
            ALTER TABLE "work_schedule_period"
                RENAME TO "temporary_work_schedule_period"
        `);
        await queryRunner.query(`
            CREATE TABLE "work_schedule_period" (
                "createdDate" datetime NOT NULL DEFAULT (datetime('now')),
                "createdUserId" integer,
                "updatedDate" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedUserId" integer,
                "deletedDate" datetime DEFAULT ('9999-12-31'),
                "deletedUserId" integer,
                "version" integer NOT NULL,
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "workScheduleId" integer NOT NULL,
                "day" integer NOT NULL,
                "hours" decimal NOT NULL
            )
        `);
        await queryRunner.query(`
            INSERT INTO "work_schedule_period"(
                    "createdDate",
                    "createdUserId",
                    "updatedDate",
                    "updatedUserId",
                    "deletedDate",
                    "deletedUserId",
                    "version",
                    "id",
                    "workScheduleId",
                    "day",
                    "hours"
                )
            SELECT "createdDate",
                "createdUserId",
                "updatedDate",
                "updatedUserId",
                "deletedDate",
                "deletedUserId",
                "version",
                "id",
                "workScheduleId",
                "day",
                "hours"
            FROM "temporary_work_schedule_period"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_work_schedule_period"
        `);
        await queryRunner.query(`
            ALTER TABLE "company"
                RENAME TO "temporary_company"
        `);
        await queryRunner.query(`
            CREATE TABLE "company" (
                "createdDate" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedDate" datetime NOT NULL DEFAULT (datetime('now')),
                "deletedDate" datetime,
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
        await queryRunner.query(`
            DROP TABLE "job"
        `);
        await queryRunner.query(`
            DROP TABLE "payment_type"
        `);
        await queryRunner.query(`
            DROP TABLE "department"
        `);
        await queryRunner.query(`
            DROP TABLE "work_schedule"
        `);
        await queryRunner.query(`
            DROP TABLE "work_schedule_period"
        `);
        await queryRunner.query(`
            ALTER TABLE "company"
                RENAME TO "temporary_company"
        `);
        await queryRunner.query(`
            CREATE TABLE "company" (
                "createdDate" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedDate" datetime NOT NULL DEFAULT (datetime('now')),
                "deletedDate" datetime,
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
