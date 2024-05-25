import { MigrationInterface, QueryRunner } from 'typeorm';

export class Gen1716545345701 implements MigrationInterface {
    name = 'Gen1716545345701';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "pay_fund_type" (
                "createdDate" TIMESTAMP NOT NULL DEFAULT now(),
                "createdUserId" integer,
                "updatedDate" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedUserId" integer,
                "deletedDate" TIMESTAMP,
                "deletedUserId" integer,
                "version" integer DEFAULT '1',
                "id" SERIAL NOT NULL,
                "name" character varying(50) NOT NULL,
                "group" character varying(30) NOT NULL,
                "calcMethod" character varying(30) NOT NULL,
                "sequence" integer NOT NULL,
                "description" character varying(300) NOT NULL,
                CONSTRAINT "PK_449c14b46474a7d64b0038ae3ad" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "pay_fund" (
                "id" SERIAL NOT NULL,
                "positionId" integer NOT NULL,
                "payPeriod" date NOT NULL,
                "accPeriod" date NOT NULL,
                "payFundTypeId" integer NOT NULL,
                "payFundCategory" character varying(30) NOT NULL,
                "incomeSum" numeric(15, 2) NOT NULL DEFAULT '0',
                "baseSum" numeric(15, 2) NOT NULL DEFAULT '0',
                "rate" numeric(6, 2) NOT NULL DEFAULT '0',
                "paySum" numeric(15, 2) NOT NULL DEFAULT '0',
                CONSTRAINT "PK_72bb3c8ac31a4b5e97e0aad85f4" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "min_wage" (
                "createdDate" TIMESTAMP NOT NULL DEFAULT now(),
                "createdUserId" integer,
                "updatedDate" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedUserId" integer,
                "deletedDate" TIMESTAMP,
                "deletedUserId" integer,
                "version" integer DEFAULT '1',
                "id" SERIAL NOT NULL,
                "dateFrom" date NOT NULL DEFAULT '1900-01-01',
                "dateTo" date NOT NULL DEFAULT '9999-12-31',
                "paySum" numeric(15, 2) NOT NULL DEFAULT '0',
                CONSTRAINT "PK_4efc386239a3353e2879891c0d4" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "min_wage"
        `);
        await queryRunner.query(`
            DROP TABLE "pay_fund"
        `);
        await queryRunner.query(`
            DROP TABLE "pay_fund_type"
        `);
    }
}
