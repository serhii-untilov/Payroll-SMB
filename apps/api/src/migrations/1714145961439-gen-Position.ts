import { MigrationInterface, QueryRunner } from 'typeorm';

export class Gen1714145961439 implements MigrationInterface {
    name = 'Gen1714145961439';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "position"
            ALTER COLUMN "description"
            SET DEFAULT ''
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "position"
            ALTER COLUMN "description" DROP DEFAULT
        `);
    }
}
