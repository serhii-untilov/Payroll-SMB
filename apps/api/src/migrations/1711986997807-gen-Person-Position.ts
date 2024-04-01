import { MigrationInterface, QueryRunner } from 'typeorm';

export class Gen1711986997807 implements MigrationInterface {
    name = 'Gen1711986997807';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "person" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "firstName" varchar(30) NOT NULL,
                "lastName" varchar(30) NOT NULL,
                "middleName" varchar(30) NOT NULL DEFAULT (''),
                "birthDate" date NOT NULL,
                "taxId" varchar(15) NOT NULL DEFAULT (''),
                "sex" varchar(10) NOT NULL DEFAULT (''),
                "phone" varchar(20) NOT NULL DEFAULT (''),
                "email" varchar(50) NOT NULL DEFAULT (''),
                "photo" varchar(260) NOT NULL DEFAULT ('')
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "position_history" (
                "createdDate" datetime NOT NULL DEFAULT (datetime('now')),
                "createdUserId" integer NOT NULL,
                "updatedDate" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedUserId" integer NOT NULL,
                "deletedDate" datetime,
                "deletedUserId" integer,
                "version" integer NOT NULL,
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "positionId" integer NOT NULL,
                "dateFrom" date NOT NULL DEFAULT ('1900-01-01'),
                "dateTo" date NOT NULL DEFAULT ('9999-12-31'),
                "departmentId" integer,
                "jobId" integer,
                "workNormId" integer,
                "paymentTypeId" integer,
                "wage" decimal(15, 2) NOT NULL DEFAULT (0),
                "rate" decimal(4, 2) NOT NULL DEFAULT (1)
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "position" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "firstName" varchar(30) NOT NULL,
                "companyId" integer NOT NULL,
                "idNumber" varchar(15) NOT NULL,
                "sequenceNumber" integer NOT NULL,
                "description" varchar(260) NOT NULL,
                "personId" integer,
                "dateFrom" date NOT NULL DEFAULT ('1900-01-01'),
                "dateTo" date NOT NULL DEFAULT ('9999-12-31')
            )
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
                CONSTRAINT "FK_bbe097728367bd569b5db49db90" FOREIGN KEY ("parentDepartmentId") REFERENCES "department" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
                CONSTRAINT "FK_1c9f0159b4ae69008bd356bb1ce" FOREIGN KEY ("companyId") REFERENCES "company" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
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
                "payPeriod" date NOT NULL,
                "checkDate" date NOT NULL,
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
                    "checkDate",
                    "paymentSchedule"
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
                "checkDate",
                "paymentSchedule"
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
        await queryRunner.query(`
            CREATE TABLE "temporary_position_history" (
                "createdDate" datetime NOT NULL DEFAULT (datetime('now')),
                "createdUserId" integer NOT NULL,
                "updatedDate" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedUserId" integer NOT NULL,
                "deletedDate" datetime,
                "deletedUserId" integer,
                "version" integer NOT NULL,
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "positionId" integer NOT NULL,
                "dateFrom" date NOT NULL DEFAULT ('1900-01-01'),
                "dateTo" date NOT NULL DEFAULT ('9999-12-31'),
                "departmentId" integer,
                "jobId" integer,
                "workNormId" integer,
                "paymentTypeId" integer,
                "wage" decimal(15, 2) NOT NULL DEFAULT (0),
                "rate" decimal(4, 2) NOT NULL DEFAULT (1),
                CONSTRAINT "FK_79cd86fb242e01d5f2174ed8aa4" FOREIGN KEY ("positionId") REFERENCES "position" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_position_history"(
                    "createdDate",
                    "createdUserId",
                    "updatedDate",
                    "updatedUserId",
                    "deletedDate",
                    "deletedUserId",
                    "version",
                    "id",
                    "positionId",
                    "dateFrom",
                    "dateTo",
                    "departmentId",
                    "jobId",
                    "workNormId",
                    "paymentTypeId",
                    "wage",
                    "rate"
                )
            SELECT "createdDate",
                "createdUserId",
                "updatedDate",
                "updatedUserId",
                "deletedDate",
                "deletedUserId",
                "version",
                "id",
                "positionId",
                "dateFrom",
                "dateTo",
                "departmentId",
                "jobId",
                "workNormId",
                "paymentTypeId",
                "wage",
                "rate"
            FROM "position_history"
        `);
        await queryRunner.query(`
            DROP TABLE "position_history"
        `);
        await queryRunner.query(`
            ALTER TABLE "temporary_position_history"
                RENAME TO "position_history"
        `);
        await queryRunner.query(`
            CREATE TABLE "temporary_position" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "firstName" varchar(30) NOT NULL,
                "companyId" integer NOT NULL,
                "idNumber" varchar(15) NOT NULL,
                "sequenceNumber" integer NOT NULL,
                "description" varchar(260) NOT NULL,
                "personId" integer,
                "dateFrom" date NOT NULL DEFAULT ('1900-01-01'),
                "dateTo" date NOT NULL DEFAULT ('9999-12-31'),
                CONSTRAINT "FK_4795972601ff1d8b498ebc3d031" FOREIGN KEY ("companyId") REFERENCES "company" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
                CONSTRAINT "FK_b562f463c12b61e6dab9bd44b9c" FOREIGN KEY ("personId") REFERENCES "person" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_position"(
                    "id",
                    "firstName",
                    "companyId",
                    "idNumber",
                    "sequenceNumber",
                    "description",
                    "personId",
                    "dateFrom",
                    "dateTo"
                )
            SELECT "id",
                "firstName",
                "companyId",
                "idNumber",
                "sequenceNumber",
                "description",
                "personId",
                "dateFrom",
                "dateTo"
            FROM "position"
        `);
        await queryRunner.query(`
            DROP TABLE "position"
        `);
        await queryRunner.query(`
            ALTER TABLE "temporary_position"
                RENAME TO "position"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "position"
                RENAME TO "temporary_position"
        `);
        await queryRunner.query(`
            CREATE TABLE "position" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "firstName" varchar(30) NOT NULL,
                "companyId" integer NOT NULL,
                "idNumber" varchar(15) NOT NULL,
                "sequenceNumber" integer NOT NULL,
                "description" varchar(260) NOT NULL,
                "personId" integer,
                "dateFrom" date NOT NULL DEFAULT ('1900-01-01'),
                "dateTo" date NOT NULL DEFAULT ('9999-12-31')
            )
        `);
        await queryRunner.query(`
            INSERT INTO "position"(
                    "id",
                    "firstName",
                    "companyId",
                    "idNumber",
                    "sequenceNumber",
                    "description",
                    "personId",
                    "dateFrom",
                    "dateTo"
                )
            SELECT "id",
                "firstName",
                "companyId",
                "idNumber",
                "sequenceNumber",
                "description",
                "personId",
                "dateFrom",
                "dateTo"
            FROM "temporary_position"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_position"
        `);
        await queryRunner.query(`
            ALTER TABLE "position_history"
                RENAME TO "temporary_position_history"
        `);
        await queryRunner.query(`
            CREATE TABLE "position_history" (
                "createdDate" datetime NOT NULL DEFAULT (datetime('now')),
                "createdUserId" integer NOT NULL,
                "updatedDate" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedUserId" integer NOT NULL,
                "deletedDate" datetime,
                "deletedUserId" integer,
                "version" integer NOT NULL,
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "positionId" integer NOT NULL,
                "dateFrom" date NOT NULL DEFAULT ('1900-01-01'),
                "dateTo" date NOT NULL DEFAULT ('9999-12-31'),
                "departmentId" integer,
                "jobId" integer,
                "workNormId" integer,
                "paymentTypeId" integer,
                "wage" decimal(15, 2) NOT NULL DEFAULT (0),
                "rate" decimal(4, 2) NOT NULL DEFAULT (1)
            )
        `);
        await queryRunner.query(`
            INSERT INTO "position_history"(
                    "createdDate",
                    "createdUserId",
                    "updatedDate",
                    "updatedUserId",
                    "deletedDate",
                    "deletedUserId",
                    "version",
                    "id",
                    "positionId",
                    "dateFrom",
                    "dateTo",
                    "departmentId",
                    "jobId",
                    "workNormId",
                    "paymentTypeId",
                    "wage",
                    "rate"
                )
            SELECT "createdDate",
                "createdUserId",
                "updatedDate",
                "updatedUserId",
                "deletedDate",
                "deletedUserId",
                "version",
                "id",
                "positionId",
                "dateFrom",
                "dateTo",
                "departmentId",
                "jobId",
                "workNormId",
                "paymentTypeId",
                "wage",
                "rate"
            FROM "temporary_position_history"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_position_history"
        `);
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
                "dateFrom" date NOT NULL DEFAULT ('1970-01-01'),
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
                "dateFrom" date NOT NULL DEFAULT ('1970-01-01'),
                "dateTo" date NOT NULL DEFAULT ('9999-12-31'),
                "payPeriod" date NOT NULL DEFAULT ('1970-01-01'),
                "checkDate" date NOT NULL DEFAULT ('1970-01-01'),
                "paymentSchedule" varchar(10) NOT NULL DEFAULT ('last-day')
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
                    "checkDate",
                    "paymentSchedule"
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
                "checkDate",
                "paymentSchedule"
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
                "createdUserId" integer NOT NULL,
                "updatedDate" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedUserId" integer NOT NULL,
                "deletedDate" datetime,
                "deletedUserId" integer,
                "version" integer NOT NULL,
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "name" varchar(50) NOT NULL,
                "companyId" integer NOT NULL,
                "dateFrom" date NOT NULL DEFAULT ('1970-01-01'),
                "dateTo" date NOT NULL DEFAULT ('9999-12-31'),
                "parentDepartmentId" integer,
                CONSTRAINT "FK_bbe097728367bd569b5db49db90" FOREIGN KEY ("parentDepartmentId") REFERENCES "department" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
                CONSTRAINT "FK_1c9f0159b4ae69008bd356bb1ce" FOREIGN KEY ("companyId") REFERENCES "company" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
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
            ALTER TABLE "work_norm"
                RENAME TO "temporary_work_norm"
        `);
        await queryRunner.query(`
            CREATE TABLE "work_norm" (
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
                "dateFrom" date NOT NULL DEFAULT ('1970-01-01'),
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
            DROP TABLE "position"
        `);
        await queryRunner.query(`
            DROP TABLE "position_history"
        `);
        await queryRunner.query(`
            DROP TABLE "person"
        `);
    }
}
