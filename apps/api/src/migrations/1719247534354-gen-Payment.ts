import { MigrationInterface, QueryRunner } from 'typeorm';

export class Gen1719247534354 implements MigrationInterface {
    name = 'Gen1719247534354';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "payment" (
                "createdDate" TIMESTAMP NOT NULL DEFAULT now(),
                "createdUserId" integer,
                "updatedDate" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedUserId" integer,
                "deletedDate" TIMESTAMP,
                "deletedUserId" integer,
                "version" integer DEFAULT '1',
                "id" SERIAL NOT NULL,
                "companyId" integer NOT NULL,
                "payPeriod" date NOT NULL,
                "accPeriod" date NOT NULL,
                "docNumber" character varying(10) NOT NULL,
                "docDate" date NOT NULL,
                "paymentTypeId" integer NOT NULL,
                "dateFrom" date NOT NULL,
                "dateTo" date NOT NULL,
                "baseSum" numeric(6, 2) NOT NULL DEFAULT '0',
                "deductions" numeric(6, 2) NOT NULL DEFAULT '0',
                "paySum" numeric(6, 2) NOT NULL DEFAULT '0',
                "funds" numeric(6, 2) NOT NULL DEFAULT '0',
                "status" character varying(10) NOT NULL,
                "recordFlags" bigint NOT NULL DEFAULT '0',
                "description" character varying(256) NOT NULL,
                CONSTRAINT "PK_fcaec7df5adf9cac408c686b2ab" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "payment_position" (
                "createdDate" TIMESTAMP NOT NULL DEFAULT now(),
                "createdUserId" integer,
                "updatedDate" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedUserId" integer,
                "deletedDate" TIMESTAMP,
                "deletedUserId" integer,
                "version" integer DEFAULT '1',
                "id" SERIAL NOT NULL,
                "paymentId" integer NOT NULL,
                "positionId" integer NOT NULL,
                "baseSum" numeric(6, 2) NOT NULL DEFAULT '0',
                "deductions" numeric(6, 2) NOT NULL DEFAULT '0',
                "paySum" numeric(6, 2) NOT NULL DEFAULT '0',
                "funds" numeric(6, 2) NOT NULL DEFAULT '0',
                "recordFlags" bigint NOT NULL DEFAULT '0',
                CONSTRAINT "PK_beb52b3caaf6ad553308bd23687" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "payment_fund" (
                "id" SERIAL NOT NULL,
                "paymentPositionId" integer NOT NULL,
                "payFundTypeId" integer NOT NULL,
                "baseSum" numeric(6, 2) NOT NULL DEFAULT '0',
                "paySum" numeric(6, 2) NOT NULL DEFAULT '0',
                "recordFlags" bigint NOT NULL DEFAULT '0',
                CONSTRAINT "PK_bcb29f80740a6a962b4b7fc3234" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "payment_deduction" (
                "id" SERIAL NOT NULL,
                "paymentPositionId" integer NOT NULL,
                "paymentTypeId" integer NOT NULL,
                "baseSum" numeric(6, 2) NOT NULL DEFAULT '0',
                "paySum" numeric(6, 2) NOT NULL DEFAULT '0',
                "recordFlags" bigint NOT NULL DEFAULT '0',
                CONSTRAINT "PK_920fb8320c0a7fd3542b333957c" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "payment_deduction"
        `);
        await queryRunner.query(`
            DROP TABLE "payment_fund"
        `);
        await queryRunner.query(`
            DROP TABLE "payment_position"
        `);
        await queryRunner.query(`
            DROP TABLE "payment"
        `);
    }
}
