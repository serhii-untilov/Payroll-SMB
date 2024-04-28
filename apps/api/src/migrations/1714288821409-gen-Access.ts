import { MigrationInterface, QueryRunner } from 'typeorm';

export class Gen1714288821409 implements MigrationInterface {
    name = 'Gen1714288821409';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "access" (
                "createdDate" TIMESTAMP NOT NULL DEFAULT now(),
                "createdUserId" integer NOT NULL,
                "updatedDate" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedUserId" integer NOT NULL,
                "deletedDate" TIMESTAMP,
                "deletedUserId" integer,
                "version" integer NOT NULL,
                "id" SERIAL NOT NULL,
                "roleType" character varying(20) NOT NULL,
                "resourceType" character varying(20) NOT NULL,
                "accessType" character varying(20) NOT NULL,
                CONSTRAINT "PK_e386259e6046c45ab06811584ed" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "access"
        `);
    }
}
