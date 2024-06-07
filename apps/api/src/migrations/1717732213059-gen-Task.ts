import { MigrationInterface, QueryRunner } from 'typeorm';

export class Gen1717732213059 implements MigrationInterface {
    name = 'Gen1717732213059';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "task"
            ADD "entityId" integer
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "task" DROP COLUMN "entityId"
        `);
    }
}
