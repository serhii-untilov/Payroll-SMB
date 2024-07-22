import { MigrationInterface, QueryRunner } from 'typeorm';

export class Seed1721650905981 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const dataSource = queryRunner.connection;
        await dataSource.query(`update payroll set "sourceType" = '' where "sourceType" is null`);
    }

    public async down(_queryRunner: QueryRunner): Promise<void> {}
}
