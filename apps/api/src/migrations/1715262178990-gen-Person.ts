import { MigrationInterface, QueryRunner } from 'typeorm';

export class Gen1715262178990 implements MigrationInterface {
    name = 'Gen1715262178990';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "person"
            ALTER COLUMN "birthDate" DROP NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "person"
            ALTER COLUMN "birthDate"
            SET NOT NULL
        `);
    }
}
