import { MigrationInterface, QueryRunner } from 'typeorm';

export class Gen1715779966568 implements MigrationInterface {
    name = 'Gen1715779966568';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "payroll" (
                "createdDate" TIMESTAMP NOT NULL DEFAULT now(),
                "createdUserId" integer,
                "updatedDate" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedUserId" integer,
                "deletedDate" TIMESTAMP,
                "deletedUserId" integer,
                "version" integer DEFAULT '1',
                "id" SERIAL NOT NULL,
                "positionId" integer NOT NULL,
                "payPeriod" date NOT NULL,
                "accPeriod" date NOT NULL,
                "paymentTypeId" integer NOT NULL,
                "dateFrom" date NOT NULL,
                "dateTo" date NOT NULL,
                "sourceType" character varying(10) NOT NULL,
                "sourceId" integer NOT NULL,
                "dateBegin" date NOT NULL,
                "dateEnd" date NOT NULL,
                "planDays" integer NOT NULL DEFAULT '0',
                "planHours" numeric(6, 2) NOT NULL DEFAULT '0',
                "planSum" numeric(15, 2) NOT NULL DEFAULT '0',
                "rate" numeric(6, 2) NOT NULL DEFAULT '0',
                "factDays" integer NOT NULL DEFAULT '0',
                "factHours" numeric(6, 2) NOT NULL DEFAULT '0',
                "factSum" numeric(15, 2) NOT NULL DEFAULT '0',
                "mask1" integer NOT NULL DEFAULT '0',
                "mask2" integer NOT NULL DEFAULT '0',
                "recordFlags" bigint NOT NULL DEFAULT '0',
                "fixedFlags" bigint NOT NULL DEFAULT '0',
                "planHoursByDay" jsonb NOT NULL,
                "factHoursByDay" jsonb NOT NULL,
                CONSTRAINT "PK_7a76b819506029fc535b6e002e0" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "payroll"
        `);
    }
}
