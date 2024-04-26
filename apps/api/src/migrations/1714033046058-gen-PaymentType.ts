import { MigrationInterface, QueryRunner } from 'typeorm';

export class Gen1714033046058 implements MigrationInterface {
    name = 'Gen1714033046058';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "payment_type"
            ADD "paymentPart" character varying(30) NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "payment_type" DROP COLUMN "paymentPart"
        `);
    }
}
