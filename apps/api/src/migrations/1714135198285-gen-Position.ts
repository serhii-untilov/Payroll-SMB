import { MigrationInterface, QueryRunner } from "typeorm";

export class Gen1714135198285 implements MigrationInterface {
    name = 'Gen1714135198285'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "position"
            ALTER COLUMN "sequenceNumber"
            SET DEFAULT '2147483647'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "position"
            ALTER COLUMN "sequenceNumber" DROP DEFAULT
        `);
    }

}
