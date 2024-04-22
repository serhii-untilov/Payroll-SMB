import { MigrationInterface, QueryRunner } from 'typeorm';

export class Gen1713782562545 implements MigrationInterface {
    name = 'Gen1713782562545';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "position"
                RENAME COLUMN "idNumber" TO "cardNumber"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "position"
                RENAME COLUMN "cardNumber" TO "idNumber"
        `);
    }
}
