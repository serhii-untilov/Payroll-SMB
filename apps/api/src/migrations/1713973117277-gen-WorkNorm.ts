import { MigrationInterface, QueryRunner } from 'typeorm';

export class Gen1713973117277 implements MigrationInterface {
    name = 'Gen1713973117277';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "work_norm_period" DROP CONSTRAINT "FK_eae1a1e0e6e8e62aa1f8875ad21"
        `);
        await queryRunner.query(`
            ALTER TABLE "work_norm_period"
            ADD CONSTRAINT "FK_eae1a1e0e6e8e62aa1f8875ad21" FOREIGN KEY ("workNormId") REFERENCES "work_norm"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "work_norm_period" DROP CONSTRAINT "FK_eae1a1e0e6e8e62aa1f8875ad21"
        `);
        await queryRunner.query(`
            ALTER TABLE "work_norm_period"
            ADD CONSTRAINT "FK_eae1a1e0e6e8e62aa1f8875ad21" FOREIGN KEY ("workNormId") REFERENCES "work_norm"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }
}
