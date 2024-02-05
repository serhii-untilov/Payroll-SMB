import { MigrationInterface, QueryRunner } from 'typeorm';

export class Gen1707129492595 implements MigrationInterface {
    name = 'Gen1707129492595';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "user" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "name" varchar(50) NOT NULL,
                "email" varchar(50) NOT NULL,
                "password" varchar(50) NOT NULL,
                "isActive" boolean NOT NULL
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "law" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "name" varchar(50) NOT NULL
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "law"
        `);
        await queryRunner.query(`
            DROP TABLE "user"
        `);
    }
}
