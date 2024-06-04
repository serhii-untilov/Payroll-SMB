import { MigrationInterface, QueryRunner } from "typeorm";

export class Gen1717488981416 implements MigrationInterface {
    name = 'Gen1717488981416'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "task" (
                "createdDate" TIMESTAMP NOT NULL DEFAULT now(),
                "createdUserId" integer,
                "updatedDate" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedUserId" integer,
                "deletedDate" TIMESTAMP,
                "deletedUserId" integer,
                "version" integer DEFAULT '1',
                "id" SERIAL NOT NULL,
                "companyId" integer NOT NULL,
                "type" character varying(30) NOT NULL,
                "dateFrom" date NOT NULL DEFAULT '1900-01-01',
                "dateTo" date NOT NULL DEFAULT '9999-12-31',
                "sequenceNumber" integer NOT NULL,
                "status" character varying(15) NOT NULL,
                CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "pay_fund_type"
            ALTER COLUMN "description" DROP NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "pay_fund_type"
            ALTER COLUMN "description"
            SET NOT NULL
        `);
        await queryRunner.query(`
            DROP TABLE "task"
        `);
    }

}
