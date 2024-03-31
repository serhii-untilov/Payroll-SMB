import { MigrationInterface, QueryRunner } from 'typeorm';

export class Gen1711528196684 implements MigrationInterface {
    name = 'Gen1711528196684';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "temporary_work_norm_period" (
                "createdDate" datetime NOT NULL DEFAULT (datetime('now')),
                "createdUserId" integer,
                "updatedDate" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedUserId" integer,
                "deletedDate" datetime,
                "deletedUserId" integer,
                "version" integer NOT NULL,
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "workNormId" integer NOT NULL,
                "day" integer NOT NULL,
                "hours" decimal NOT NULL
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
            CREATE TABLE "pay_period" (
                "createdDate" datetime NOT NULL DEFAULT (datetime('now')),
                "createdUserId" integer NOT NULL,
                "updatedDate" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedUserId" integer NOT NULL,
                "deletedDate" datetime,
                "deletedUserId" integer,
                "version" integer NOT NULL,
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "companyId" integer NOT NULL,
                "dateFrom" date NOT NULL DEFAULT ('1900-01-01'),
                "dateTo" date NOT NULL DEFAULT ('9999-12-31'),
                "state" varchar(10) NOT NULL DEFAULT ('opened'),
                "inBalance" decimal(15, 2) NOT NULL DEFAULT (0),
                "accrual" decimal(15, 2) NOT NULL DEFAULT (0),
                "deduction" decimal(15, 2) NOT NULL DEFAULT (0),
                "tax" decimal(15, 2) NOT NULL DEFAULT (0),
                "netPay" decimal(15, 2) NOT NULL DEFAULT (0),
                "payment" decimal(15, 2) NOT NULL DEFAULT (0),
                "outBalance" decimal(15, 2) NOT NULL DEFAULT (0)
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "temporary_work_norm_period" (
                "createdDate" datetime NOT NULL DEFAULT (datetime('now')),
                "createdUserId" integer NOT NULL,
                "updatedDate" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedUserId" integer NOT NULL,
                "deletedDate" datetime,
                "deletedUserId" integer,
                "version" integer NOT NULL,
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "workNormId" integer NOT NULL,
                "day" integer NOT NULL,
                "hours" decimal NOT NULL
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
            CREATE TABLE "temporary_work_norm" (
                "createdDate" datetime NOT NULL DEFAULT (datetime('now')),
                "createdUserId" integer NOT NULL,
                "updatedDate" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedUserId" integer NOT NULL,
                "deletedDate" datetime,
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
            INSERT INTO "temporary_work_norm"(
                    "createdDate",
                    "createdUserId",
                    "updatedDate",
                    "updatedUserId",
                    "deletedDate",
                    "deletedUserId",
                    "version",
                    "id",
                    "name",
                    "type",
                    "dateFrom",
                    "dateTo"
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
                "type",
                "dateFrom",
                "dateTo"
            FROM "work_norm"
        `);
        await queryRunner.query(`
            DROP TABLE "work_norm"
        `);
        await queryRunner.query(`
            ALTER TABLE "temporary_work_norm"
                RENAME TO "work_norm"
        `);
        await queryRunner.query(`
            CREATE TABLE "temporary_payment_type" (
                "createdDate" datetime NOT NULL DEFAULT (datetime('now')),
                "createdUserId" integer NOT NULL,
                "updatedDate" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedUserId" integer NOT NULL,
                "deletedDate" datetime,
                "deletedUserId" integer,
                "version" integer NOT NULL,
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "name" varchar(50) NOT NULL,
                "paymentGroup" varchar(30) NOT NULL,
                "paymentMethod" varchar(30) NOT NULL
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_payment_type"(
                    "createdDate",
                    "createdUserId",
                    "updatedDate",
                    "updatedUserId",
                    "deletedDate",
                    "deletedUserId",
                    "version",
                    "id",
                    "name",
                    "paymentGroup",
                    "paymentMethod"
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
                "paymentGroup",
                "paymentMethod"
            FROM "payment_type"
        `);
        await queryRunner.query(`
            DROP TABLE "payment_type"
        `);
        await queryRunner.query(`
            ALTER TABLE "temporary_payment_type"
                RENAME TO "payment_type"
        `);
        await queryRunner.query(`
            CREATE TABLE "temporary_department" (
                "createdDate" datetime NOT NULL DEFAULT (datetime('now')),
                "createdUserId" integer NOT NULL,
                "updatedDate" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedUserId" integer NOT NULL,
                "deletedDate" datetime,
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
                "checkDate" date NOT NULL DEFAULT ('1900-01-01')
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
        await queryRunner.query(`
            CREATE TABLE "temporary_job" (
                "createdDate" datetime NOT NULL DEFAULT (datetime('now')),
                "createdUserId" integer NOT NULL,
                "updatedDate" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedUserId" integer NOT NULL,
                "deletedDate" datetime,
                "deletedUserId" integer,
                "version" integer NOT NULL,
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "name" varchar(50) NOT NULL
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_job"(
                    "createdDate",
                    "createdUserId",
                    "updatedDate",
                    "updatedUserId",
                    "deletedDate",
                    "deletedUserId",
                    "version",
                    "id",
                    "name"
                )
            SELECT "createdDate",
                "createdUserId",
                "updatedDate",
                "updatedUserId",
                "deletedDate",
                "deletedUserId",
                "version",
                "id",
                "name"
            FROM "job"
        `);
        await queryRunner.query(`
            DROP TABLE "job"
        `);
        await queryRunner.query(`
            ALTER TABLE "temporary_job"
                RENAME TO "job"
        `);
        await queryRunner.query(`
            CREATE TABLE "temporary_work_norm_period" (
                "createdDate" datetime NOT NULL DEFAULT (datetime('now')),
                "createdUserId" integer NOT NULL,
                "updatedDate" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedUserId" integer NOT NULL,
                "deletedDate" datetime,
                "deletedUserId" integer,
                "version" integer NOT NULL,
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "workNormId" integer NOT NULL,
                "day" integer NOT NULL,
                "hours" decimal NOT NULL,
                CONSTRAINT "FK_eae1a1e0e6e8e62aa1f8875ad21" FOREIGN KEY ("workNormId") REFERENCES "work_norm" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
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
            CREATE TABLE "temporary_pay_period" (
                "createdDate" datetime NOT NULL DEFAULT (datetime('now')),
                "createdUserId" integer NOT NULL,
                "updatedDate" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedUserId" integer NOT NULL,
                "deletedDate" datetime,
                "deletedUserId" integer,
                "version" integer NOT NULL,
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "companyId" integer NOT NULL,
                "dateFrom" date NOT NULL DEFAULT ('1900-01-01'),
                "dateTo" date NOT NULL DEFAULT ('9999-12-31'),
                "state" varchar(10) NOT NULL DEFAULT ('opened'),
                "inBalance" decimal(15, 2) NOT NULL DEFAULT (0),
                "accrual" decimal(15, 2) NOT NULL DEFAULT (0),
                "deduction" decimal(15, 2) NOT NULL DEFAULT (0),
                "tax" decimal(15, 2) NOT NULL DEFAULT (0),
                "netPay" decimal(15, 2) NOT NULL DEFAULT (0),
                "payment" decimal(15, 2) NOT NULL DEFAULT (0),
                "outBalance" decimal(15, 2) NOT NULL DEFAULT (0),
                CONSTRAINT "FK_584ecbca8afc0629d4283e63d6f" FOREIGN KEY ("companyId") REFERENCES "company" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_pay_period"(
                    "createdDate",
                    "createdUserId",
                    "updatedDate",
                    "updatedUserId",
                    "deletedDate",
                    "deletedUserId",
                    "version",
                    "id",
                    "companyId",
                    "dateFrom",
                    "dateTo",
                    "state",
                    "inBalance",
                    "accrual",
                    "deduction",
                    "tax",
                    "netPay",
                    "payment",
                    "outBalance"
                )
            SELECT "createdDate",
                "createdUserId",
                "updatedDate",
                "updatedUserId",
                "deletedDate",
                "deletedUserId",
                "version",
                "id",
                "companyId",
                "dateFrom",
                "dateTo",
                "state",
                "inBalance",
                "accrual",
                "deduction",
                "tax",
                "netPay",
                "payment",
                "outBalance"
            FROM "pay_period"
        `);
        await queryRunner.query(`
            DROP TABLE "pay_period"
        `);
        await queryRunner.query(`
            ALTER TABLE "temporary_pay_period"
                RENAME TO "pay_period"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "pay_period"
                RENAME TO "temporary_pay_period"
        `);
        await queryRunner.query(`
            CREATE TABLE "pay_period" (
                "createdDate" datetime NOT NULL DEFAULT (datetime('now')),
                "createdUserId" integer NOT NULL,
                "updatedDate" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedUserId" integer NOT NULL,
                "deletedDate" datetime,
                "deletedUserId" integer,
                "version" integer NOT NULL,
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "companyId" integer NOT NULL,
                "dateFrom" date NOT NULL DEFAULT ('1900-01-01'),
                "dateTo" date NOT NULL DEFAULT ('9999-12-31'),
                "state" varchar(10) NOT NULL DEFAULT ('opened'),
                "inBalance" decimal(15, 2) NOT NULL DEFAULT (0),
                "accrual" decimal(15, 2) NOT NULL DEFAULT (0),
                "deduction" decimal(15, 2) NOT NULL DEFAULT (0),
                "tax" decimal(15, 2) NOT NULL DEFAULT (0),
                "netPay" decimal(15, 2) NOT NULL DEFAULT (0),
                "payment" decimal(15, 2) NOT NULL DEFAULT (0),
                "outBalance" decimal(15, 2) NOT NULL DEFAULT (0)
            )
        `);
        await queryRunner.query(`
            INSERT INTO "pay_period"(
                    "createdDate",
                    "createdUserId",
                    "updatedDate",
                    "updatedUserId",
                    "deletedDate",
                    "deletedUserId",
                    "version",
                    "id",
                    "companyId",
                    "dateFrom",
                    "dateTo",
                    "state",
                    "inBalance",
                    "accrual",
                    "deduction",
                    "tax",
                    "netPay",
                    "payment",
                    "outBalance"
                )
            SELECT "createdDate",
                "createdUserId",
                "updatedDate",
                "updatedUserId",
                "deletedDate",
                "deletedUserId",
                "version",
                "id",
                "companyId",
                "dateFrom",
                "dateTo",
                "state",
                "inBalance",
                "accrual",
                "deduction",
                "tax",
                "netPay",
                "payment",
                "outBalance"
            FROM "temporary_pay_period"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_pay_period"
        `);
        await queryRunner.query(`
            ALTER TABLE "work_norm_period"
                RENAME TO "temporary_work_norm_period"
        `);
        await queryRunner.query(`
            CREATE TABLE "work_norm_period" (
                "createdDate" datetime NOT NULL DEFAULT (datetime('now')),
                "createdUserId" integer NOT NULL,
                "updatedDate" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedUserId" integer NOT NULL,
                "deletedDate" datetime,
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
            ALTER TABLE "job"
                RENAME TO "temporary_job"
        `);
        await queryRunner.query(`
            CREATE TABLE "job" (
                "createdDate" datetime NOT NULL DEFAULT (datetime('now')),
                "createdUserId" integer,
                "updatedDate" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedUserId" integer,
                "deletedDate" datetime,
                "deletedUserId" integer,
                "version" integer NOT NULL,
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "name" varchar(50) NOT NULL
            )
        `);
        await queryRunner.query(`
            INSERT INTO "job"(
                    "createdDate",
                    "createdUserId",
                    "updatedDate",
                    "updatedUserId",
                    "deletedDate",
                    "deletedUserId",
                    "version",
                    "id",
                    "name"
                )
            SELECT "createdDate",
                "createdUserId",
                "updatedDate",
                "updatedUserId",
                "deletedDate",
                "deletedUserId",
                "version",
                "id",
                "name"
            FROM "temporary_job"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_job"
        `);
        await queryRunner.query(`
            ALTER TABLE "company"
                RENAME TO "temporary_company"
        `);
        await queryRunner.query(`
            CREATE TABLE "company" (
                "createdDate" datetime NOT NULL DEFAULT (datetime('now')),
                "createdUserId" integer,
                "updatedDate" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedUserId" integer,
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
                "deletedDate" datetime,
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
            ALTER TABLE "payment_type"
                RENAME TO "temporary_payment_type"
        `);
        await queryRunner.query(`
            CREATE TABLE "payment_type" (
                "createdDate" datetime NOT NULL DEFAULT (datetime('now')),
                "createdUserId" integer,
                "updatedDate" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedUserId" integer,
                "deletedDate" datetime,
                "deletedUserId" integer,
                "version" integer NOT NULL,
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "name" varchar(50) NOT NULL,
                "paymentGroup" varchar(30) NOT NULL,
                "paymentMethod" varchar(30) NOT NULL
            )
        `);
        await queryRunner.query(`
            INSERT INTO "payment_type"(
                    "createdDate",
                    "createdUserId",
                    "updatedDate",
                    "updatedUserId",
                    "deletedDate",
                    "deletedUserId",
                    "version",
                    "id",
                    "name",
                    "paymentGroup",
                    "paymentMethod"
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
                "paymentGroup",
                "paymentMethod"
            FROM "temporary_payment_type"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_payment_type"
        `);
        await queryRunner.query(`
            ALTER TABLE "work_norm"
                RENAME TO "temporary_work_norm"
        `);
        await queryRunner.query(`
            CREATE TABLE "work_norm" (
                "createdDate" datetime NOT NULL DEFAULT (datetime('now')),
                "createdUserId" integer,
                "updatedDate" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedUserId" integer,
                "deletedDate" datetime,
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
            INSERT INTO "work_norm"(
                    "createdDate",
                    "createdUserId",
                    "updatedDate",
                    "updatedUserId",
                    "deletedDate",
                    "deletedUserId",
                    "version",
                    "id",
                    "name",
                    "type",
                    "dateFrom",
                    "dateTo"
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
                "type",
                "dateFrom",
                "dateTo"
            FROM "temporary_work_norm"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_work_norm"
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
                "deletedDate" datetime,
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
            DROP TABLE "pay_period"
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
                "deletedDate" datetime,
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
    }
}