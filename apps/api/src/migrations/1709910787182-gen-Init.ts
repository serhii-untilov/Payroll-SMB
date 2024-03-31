import { MigrationInterface, QueryRunner } from 'typeorm';

export class Gen1709910787182 implements MigrationInterface {
    name = 'Gen1709910787182';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "work_norm_period" (
                "createdDate" datetime NOT NULL DEFAULT (datetime('now')),
                "createdUserId" integer,
                "updatedDate" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedUserId" integer,
                "deletedDate" datetime DEFAULT ('9999-12-31'),
                "deletedUserId" integer,
                "version" integer NOT NULL,
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "workNormId" integer NOT NULL,
                "day" integer NOT NULL,
                "hours" decimal NOT NULL
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "work_norm" (
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
                "dateFrom" date NOT NULL DEFAULT ('1900-01-01'),
                "dateTo" date NOT NULL DEFAULT ('9999-12-31')
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "role" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "name" varchar(50) NOT NULL,
                "type" varchar(15) NOT NULL DEFAULT ('guest')
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "user" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "firstName" varchar(50) NOT NULL,
                "lastName" varchar(50) NOT NULL,
                "email" varchar(50) NOT NULL,
                "password" varchar(50) NOT NULL,
                "refreshToken" varchar,
                "isActive" boolean NOT NULL DEFAULT (1),
                "language" varchar(5),
                "roleId" integer NOT NULL
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "accounting" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "name" varchar(50) NOT NULL,
                "type" varchar(15) NOT NULL DEFAULT ('generic')
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
                "dateFrom" date NOT NULL DEFAULT ('1900-01-01'),
                "dateTo" date NOT NULL DEFAULT ('9999-12-31'),
                "parentDepartmentId" integer
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "law" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "name" varchar(50) NOT NULL,
                "type" varchar(15) NOT NULL DEFAULT ('ukraine')
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "company" (
                "createdDate" datetime NOT NULL DEFAULT (datetime('now')),
                "createdUserId" integer,
                "updatedDate" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedUserId" integer,
                "deletedDate" datetime DEFAULT ('9999-12-31'),
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
            CREATE TABLE "user_company" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "userId" integer NOT NULL,
                "companyId" integer NOT NULL,
                "roleId" integer NOT NULL,
                "roleIdId" integer
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
            CREATE TABLE "temporary_work_norm_period" (
                "createdDate" datetime NOT NULL DEFAULT (datetime('now')),
                "createdUserId" integer,
                "updatedDate" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedUserId" integer,
                "deletedDate" datetime DEFAULT ('9999-12-31'),
                "deletedUserId" integer,
                "version" integer NOT NULL,
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "workNormId" integer NOT NULL,
                "day" integer NOT NULL,
                "hours" decimal NOT NULL,
                CONSTRAINT "FK_3c4b80ca3177a2927f615f480cc" FOREIGN KEY ("workNormId") REFERENCES "work_norm" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_work_norm_period"(
                    "createdDate",
                    "createdUserId",
                    "updatedDate",
                    "updatedUserId",
                    "deletedDate",
                    "deletedUserId",
                    "version",
                    "id",
                    "workNormId",
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
                "workNormId",
                "day",
                "hours"
            FROM "work_norm_period"
        `);
        await queryRunner.query(`
            DROP TABLE "work_norm_period"
        `);
        await queryRunner.query(`
            ALTER TABLE "temporary_work_norm_period"
                RENAME TO "work_norm_period"
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
                "dateFrom" date NOT NULL DEFAULT ('1900-01-01'),
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
                "dateFrom" date NOT NULL DEFAULT ('1900-01-01'),
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
            ALTER TABLE "work_norm_period"
                RENAME TO "temporary_work_norm_period"
        `);
        await queryRunner.query(`
            CREATE TABLE "work_norm_period" (
                "createdDate" datetime NOT NULL DEFAULT (datetime('now')),
                "createdUserId" integer,
                "updatedDate" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedUserId" integer,
                "deletedDate" datetime DEFAULT ('9999-12-31'),
                "deletedUserId" integer,
                "version" integer NOT NULL,
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "workNormId" integer NOT NULL,
                "day" integer NOT NULL,
                "hours" decimal NOT NULL
            )
        `);
        await queryRunner.query(`
            INSERT INTO "work_norm_period"(
                    "createdDate",
                    "createdUserId",
                    "updatedDate",
                    "updatedUserId",
                    "deletedDate",
                    "deletedUserId",
                    "version",
                    "id",
                    "workNormId",
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
                "workNormId",
                "day",
                "hours"
            FROM "temporary_work_norm_period"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_work_norm_period"
        `);
        await queryRunner.query(`
            DROP TABLE "job"
        `);
        await queryRunner.query(`
            DROP TABLE "payment_type"
        `);
        await queryRunner.query(`
            DROP TABLE "user_company"
        `);
        await queryRunner.query(`
            DROP TABLE "company"
        `);
        await queryRunner.query(`
            DROP TABLE "law"
        `);
        await queryRunner.query(`
            DROP TABLE "department"
        `);
        await queryRunner.query(`
            DROP TABLE "accounting"
        `);
        await queryRunner.query(`
            DROP TABLE "user"
        `);
        await queryRunner.query(`
            DROP TABLE "role"
        `);
        await queryRunner.query(`
            DROP TABLE "work_norm"
        `);
        await queryRunner.query(`
            DROP TABLE "work_norm_period"
        `);
    }
}
