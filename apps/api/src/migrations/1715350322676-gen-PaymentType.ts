import { MigrationInterface, QueryRunner } from 'typeorm';

export class Gen1715350322676 implements MigrationInterface {
    name = 'Gen1715350322676';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "payment_type"
                RENAME COLUMN "paymentMethod" TO "calcMethod"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "payment_type"
                RENAME COLUMN "calcMethod" TO "paymentMethod"
        `);
    }
}
