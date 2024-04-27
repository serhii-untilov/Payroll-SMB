import { MigrationInterface, QueryRunner } from 'typeorm';

export class Gen1714020981708 implements MigrationInterface {
    name = 'Gen1714020981708';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "payment_type"
            ADD "description" character varying(300) NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "payment_type" DROP COLUMN "description"
        `);
    }
}
