import { MigrationInterface, QueryRunner } from "typeorm";

export class Gen1711987830258 implements MigrationInterface {
    name = 'Gen1711987830258'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "temporary_person" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "firstName" varchar(30) NOT NULL,
                "lastName" varchar(30) NOT NULL,
                "middleName" varchar(30) NOT NULL DEFAULT (''),
                "birthDate" date NOT NULL,
                "taxId" varchar(15) NOT NULL DEFAULT (''),
                "sex" varchar(10) NOT NULL DEFAULT (''),
                "phone" varchar(20) NOT NULL DEFAULT (''),
                "email" varchar(50) NOT NULL DEFAULT (''),
                "photo" varchar(260) NOT NULL DEFAULT (''),
                "createdDate" datetime NOT NULL DEFAULT (datetime('now')),
                "createdUserId" integer NOT NULL,
                "updatedDate" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedUserId" integer NOT NULL,
                "deletedDate" datetime,
                "deletedUserId" integer,
                "version" integer NOT NULL
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_person"(
                    "id",
                    "firstName",
                    "lastName",
                    "middleName",
                    "birthDate",
                    "taxId",
                    "sex",
                    "phone",
                    "email",
                    "photo"
                )
            SELECT "id",
                "firstName",
                "lastName",
                "middleName",
                "birthDate",
                "taxId",
                "sex",
                "phone",
                "email",
                "photo"
            FROM "person"
        `);
        await queryRunner.query(`
            DROP TABLE "person"
        `);
        await queryRunner.query(`
            ALTER TABLE "temporary_person"
                RENAME TO "person"
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
                "createdDate" datetime NOT NULL DEFAULT (datetime('now')),
                "createdUserId" integer NOT NULL,
                "updatedDate" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedUserId" integer NOT NULL,
                "deletedDate" datetime,
                "deletedUserId" integer,
                "version" integer NOT NULL,
                CONSTRAINT "FK_b562f463c12b61e6dab9bd44b9c" FOREIGN KEY ("personId") REFERENCES "person" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
                CONSTRAINT "FK_4795972601ff1d8b498ebc3d031" FOREIGN KEY ("companyId") REFERENCES "company" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
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
                "dateTo" date NOT NULL DEFAULT ('9999-12-31'),
                CONSTRAINT "FK_b562f463c12b61e6dab9bd44b9c" FOREIGN KEY ("personId") REFERENCES "person" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
                CONSTRAINT "FK_4795972601ff1d8b498ebc3d031" FOREIGN KEY ("companyId") REFERENCES "company" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
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
            ALTER TABLE "person"
                RENAME TO "temporary_person"
        `);
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
            INSERT INTO "person"(
                    "id",
                    "firstName",
                    "lastName",
                    "middleName",
                    "birthDate",
                    "taxId",
                    "sex",
                    "phone",
                    "email",
                    "photo"
                )
            SELECT "id",
                "firstName",
                "lastName",
                "middleName",
                "birthDate",
                "taxId",
                "sex",
                "phone",
                "email",
                "photo"
            FROM "temporary_person"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_person"
        `);
    }

}
