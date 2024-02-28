import { MigrationInterface, QueryRunner } from 'typeorm';

export class Gen1709116455593 implements MigrationInterface {
    name = 'Gen1709116455593';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "user" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "firstName" varchar(50) NOT NULL,
                "lastName" varchar(50) NOT NULL,
                "email" varchar(50) NOT NULL,
                "password" varchar(50) NOT NULL,
                "refreshToken" varchar,
                "isActive" boolean NOT NULL DEFAULT (1),
                "language" varchar(5)
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "role" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "name" varchar(50) NOT NULL
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "law" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "name" varchar(50) NOT NULL
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "user_roles" (
                "userId" integer NOT NULL,
                "roleId" integer NOT NULL,
                PRIMARY KEY ("userId", "roleId")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_472b25323af01488f1f66a06b6" ON "user_roles" ("userId")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_86033897c009fcca8b6505d6be" ON "user_roles" ("roleId")
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_472b25323af01488f1f66a06b6"
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_86033897c009fcca8b6505d6be"
        `);
        await queryRunner.query(`
            CREATE TABLE "temporary_user_roles" (
                "userId" integer NOT NULL,
                "roleId" integer NOT NULL,
                CONSTRAINT "FK_472b25323af01488f1f66a06b67" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
                CONSTRAINT "FK_86033897c009fcca8b6505d6be2" FOREIGN KEY ("roleId") REFERENCES "role" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
                PRIMARY KEY ("userId", "roleId")
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_user_roles"("userId", "roleId")
            SELECT "userId",
                "roleId"
            FROM "user_roles"
        `);
        await queryRunner.query(`
            DROP TABLE "user_roles"
        `);
        await queryRunner.query(`
            ALTER TABLE "temporary_user_roles"
                RENAME TO "user_roles"
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_472b25323af01488f1f66a06b6" ON "user_roles" ("userId")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_86033897c009fcca8b6505d6be" ON "user_roles" ("roleId")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX "IDX_86033897c009fcca8b6505d6be"
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_472b25323af01488f1f66a06b6"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_roles"
                RENAME TO "temporary_user_roles"
        `);
        await queryRunner.query(`
            CREATE TABLE "user_roles" (
                "userId" integer NOT NULL,
                "roleId" integer NOT NULL,
                PRIMARY KEY ("userId", "roleId")
            )
        `);
        await queryRunner.query(`
            INSERT INTO "user_roles"("userId", "roleId")
            SELECT "userId",
                "roleId"
            FROM "temporary_user_roles"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_user_roles"
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_86033897c009fcca8b6505d6be" ON "user_roles" ("roleId")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_472b25323af01488f1f66a06b6" ON "user_roles" ("userId")
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_86033897c009fcca8b6505d6be"
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_472b25323af01488f1f66a06b6"
        `);
        await queryRunner.query(`
            DROP TABLE "user_roles"
        `);
        await queryRunner.query(`
            DROP TABLE "law"
        `);
        await queryRunner.query(`
            DROP TABLE "role"
        `);
        await queryRunner.query(`
            DROP TABLE "user"
        `);
    }
}
