import { MigrationInterface, QueryRunner } from 'typeorm';

export class Gen1717740728332 implements MigrationInterface {
    name = 'Gen1717740728332';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "person"
                RENAME COLUMN "birthDate" TO "birthday"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "person"
                RENAME COLUMN "birthday" TO "birthDate"
        `);
    }
}
