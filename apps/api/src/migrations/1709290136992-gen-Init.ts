import { MigrationInterface, QueryRunner } from 'typeorm';

export class Gen1709290136992 implements MigrationInterface {
    name = 'Gen1709290136992_Init';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "role" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "name" varchar(50) NOT NULL
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
            CREATE TABLE "law" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "name" varchar(50) NOT NULL,
                "type" varchar(15) NOT NULL DEFAULT ('ukraine')
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "company" (
                "createdDate" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedDate" datetime NOT NULL DEFAULT (datetime('now')),
                "deletedDate" datetime,
                "version" integer NOT NULL,
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "name" varchar(50) NOT NULL,
                "taxId" varchar(15),
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
            CREATE TABLE "user" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "firstName" varchar(50) NOT NULL,
                "lastName" varchar(50) NOT NULL,
                "email" varchar(50) NOT NULL,
                "password" varchar(50) NOT NULL,
                "refreshToken" varchar,
                "isActive" boolean NOT NULL DEFAULT (1),
                "language" varchar(5)
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "user_roles" (
                "userId" integer NOT NULL,
                "roleId" integer NOT NULL,
                PRIMARY KEY ("userId", "roleId")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_472b25323af01488f1f66a06b6" ON "user_roles" ("userId")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_86033897c009fcca8b6505d6be" ON "user_roles" ("roleId")
        `);
        await queryRunner.query(`
            CREATE TABLE "temporary_company" (
                "createdDate" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedDate" datetime NOT NULL DEFAULT (datetime('now')),
                "deletedDate" datetime,
                "version" integer NOT NULL,
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "name" varchar(50) NOT NULL,
                "taxId" varchar(15),
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
            DROP INDEX "IDX_472b25323af01488f1f66a06b6"
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_86033897c009fcca8b6505d6be"
        `);
        await queryRunner.query(`
            CREATE TABLE "temporary_user_roles" (
                "userId" integer NOT NULL,
                "roleId" integer NOT NULL,
                CONSTRAINT "FK_472b25323af01488f1f66a06b67" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
                CONSTRAINT "FK_86033897c009fcca8b6505d6be2" FOREIGN KEY ("roleId") REFERENCES "role" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
                PRIMARY KEY ("userId", "roleId")
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_user_roles"("userId", "roleId")
            SELECT "userId",
                "roleId"
            FROM "user_roles"
        `);
        await queryRunner.query(`
            DROP TABLE "user_roles"
        `);
        await queryRunner.query(`
            ALTER TABLE "temporary_user_roles"
                RENAME TO "user_roles"
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_472b25323af01488f1f66a06b6" ON "user_roles" ("userId")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_86033897c009fcca8b6505d6be" ON "user_roles" ("roleId")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX "IDX_86033897c009fcca8b6505d6be"
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_472b25323af01488f1f66a06b6"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_roles"
                RENAME TO "temporary_user_roles"
        `);
        await queryRunner.query(`
            CREATE TABLE "user_roles" (
                "userId" integer NOT NULL,
                "roleId" integer NOT NULL,
                PRIMARY KEY ("userId", "roleId")
            )
        `);
        await queryRunner.query(`
            INSERT INTO "user_roles"("userId", "roleId")
            SELECT "userId",
                "roleId"
            FROM "temporary_user_roles"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_user_roles"
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_86033897c009fcca8b6505d6be" ON "user_roles" ("roleId")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_472b25323af01488f1f66a06b6" ON "user_roles" ("userId")
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
                "taxId" varchar(15),
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
            DROP INDEX "IDX_86033897c009fcca8b6505d6be"
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_472b25323af01488f1f66a06b6"
        `);
        await queryRunner.query(`
            DROP TABLE "user_roles"
        `);
        await queryRunner.query(`
            DROP TABLE "user"
        `);
        await queryRunner.query(`
            DROP TABLE "company"
        `);
        await queryRunner.query(`
            DROP TABLE "law"
        `);
        await queryRunner.query(`
            DROP TABLE "accounting"
        `);
        await queryRunner.query(`
            DROP TABLE "role"
        `);
    }
}
