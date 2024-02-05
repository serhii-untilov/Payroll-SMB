import { MigrationInterface, QueryRunner } from 'typeorm';

export class Gen1707140375708 implements MigrationInterface {
    name = 'Gen1707140375708';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "law" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "name" varchar(50) NOT NULL
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "user" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "name" varchar(50) NOT NULL,
                "email" varchar(50) NOT NULL,
                "password" varchar(50) NOT NULL,
                "isActive" boolean NOT NULL
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "user"
        `);
        await queryRunner.query(`
            DROP TABLE "law"
        `);
    }
}
