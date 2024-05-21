import { MigrationInterface, QueryRunner } from 'typeorm';

export class Gen1716200503791 implements MigrationInterface {
    name = 'Gen1716200503791';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "position_balance" (
                "id" SERIAL NOT NULL,
                "positionId" integer NOT NULL,
                "payPeriod" date NOT NULL,
                "inBalance" numeric(15, 2) NOT NULL DEFAULT '0',
                "accruals" numeric(15, 2) NOT NULL DEFAULT '0',
                "deductions" numeric(15, 2) NOT NULL DEFAULT '0',
                "outBalance" numeric(15, 2) NOT NULL DEFAULT '0',
                CONSTRAINT "PK_0eb8b250b3c0e1a936736986f90" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "position_balance"
            ADD CONSTRAINT "FK_31e7744ab10ddc67f5c06a1752b" FOREIGN KEY ("positionId") REFERENCES "position"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "position_balance" DROP CONSTRAINT "FK_31e7744ab10ddc67f5c06a1752b"
        `);
        await queryRunner.query(`
            DROP TABLE "position_balance"
        `);
    }
}
