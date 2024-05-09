import { MigrationInterface, QueryRunner } from 'typeorm';

export class Gen1714749869186 implements MigrationInterface {
    name = 'Gen1714749869186';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD "createdDate" TIMESTAMP NOT NULL DEFAULT now()
        `);
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD "createdUserId" integer
        `);
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD "updatedDate" TIMESTAMP NOT NULL DEFAULT now()
        `);
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD "updatedUserId" integer
        `);
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD "deletedDate" TIMESTAMP
        `);
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD "deletedUserId" integer
        `);
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD "version" integer DEFAULT '1'
        `);
        await queryRunner.query(`
            ALTER TABLE "accounting"
            ADD "createdDate" TIMESTAMP NOT NULL DEFAULT now()
        `);
        await queryRunner.query(`
            ALTER TABLE "accounting"
            ADD "createdUserId" integer
        `);
        await queryRunner.query(`
            ALTER TABLE "accounting"
            ADD "updatedDate" TIMESTAMP NOT NULL DEFAULT now()
        `);
        await queryRunner.query(`
            ALTER TABLE "accounting"
            ADD "updatedUserId" integer
        `);
        await queryRunner.query(`
            ALTER TABLE "accounting"
            ADD "deletedDate" TIMESTAMP
        `);
        await queryRunner.query(`
            ALTER TABLE "accounting"
            ADD "deletedUserId" integer
        `);
        await queryRunner.query(`
            ALTER TABLE "accounting"
            ADD "version" integer DEFAULT '1'
        `);
        await queryRunner.query(`
            ALTER TABLE "user_company"
            ADD "createdDate" TIMESTAMP NOT NULL DEFAULT now()
        `);
        await queryRunner.query(`
            ALTER TABLE "user_company"
            ADD "createdUserId" integer
        `);
        await queryRunner.query(`
            ALTER TABLE "user_company"
            ADD "updatedDate" TIMESTAMP NOT NULL DEFAULT now()
        `);
        await queryRunner.query(`
            ALTER TABLE "user_company"
            ADD "updatedUserId" integer
        `);
        await queryRunner.query(`
            ALTER TABLE "user_company"
            ADD "deletedDate" TIMESTAMP
        `);
        await queryRunner.query(`
            ALTER TABLE "user_company"
            ADD "deletedUserId" integer
        `);
        await queryRunner.query(`
            ALTER TABLE "user_company"
            ADD "version" integer DEFAULT '1'
        `);
        await queryRunner.query(`
            ALTER TABLE "work_norm_period"
            ALTER COLUMN "createdUserId" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "work_norm_period"
            ALTER COLUMN "updatedUserId" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "work_norm_period"
            ALTER COLUMN "version" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "work_norm_period"
            ALTER COLUMN "version"
            SET DEFAULT '1'
        `);
        await queryRunner.query(`
            ALTER TABLE "work_norm"
            ALTER COLUMN "createdUserId" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "work_norm"
            ALTER COLUMN "updatedUserId" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "work_norm"
            ALTER COLUMN "version" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "work_norm"
            ALTER COLUMN "version"
            SET DEFAULT '1'
        `);
        await queryRunner.query(`
            ALTER TABLE "department"
            ALTER COLUMN "createdUserId" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "department"
            ALTER COLUMN "updatedUserId" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "department"
            ALTER COLUMN "version" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "department"
            ALTER COLUMN "version"
            SET DEFAULT '1'
        `);
        await queryRunner.query(`
            ALTER TABLE "person"
            ALTER COLUMN "createdUserId" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "person"
            ALTER COLUMN "updatedUserId" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "person"
            ALTER COLUMN "version" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "person"
            ALTER COLUMN "version"
            SET DEFAULT '1'
        `);
        await queryRunner.query(`
            ALTER TABLE "job"
            ALTER COLUMN "createdUserId" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "job"
            ALTER COLUMN "updatedUserId" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "job"
            ALTER COLUMN "version" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "job"
            ALTER COLUMN "version"
            SET DEFAULT '1'
        `);
        await queryRunner.query(`
            ALTER TABLE "payment_type"
            ALTER COLUMN "createdUserId" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "payment_type"
            ALTER COLUMN "updatedUserId" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "payment_type"
            ALTER COLUMN "version" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "payment_type"
            ALTER COLUMN "version"
            SET DEFAULT '1'
        `);
        await queryRunner.query(`
            ALTER TABLE "position_history"
            ALTER COLUMN "createdUserId" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "position_history"
            ALTER COLUMN "updatedUserId" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "position_history"
            ALTER COLUMN "version" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "position_history"
            ALTER COLUMN "version"
            SET DEFAULT '1'
        `);
        await queryRunner.query(`
            ALTER TABLE "position"
            ALTER COLUMN "createdUserId" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "position"
            ALTER COLUMN "updatedUserId" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "position"
            ALTER COLUMN "version" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "position"
            ALTER COLUMN "version"
            SET DEFAULT '1'
        `);
        await queryRunner.query(`
            ALTER TABLE "company"
            ALTER COLUMN "createdUserId" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "company"
            ALTER COLUMN "updatedUserId" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "company"
            ALTER COLUMN "version" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "company"
            ALTER COLUMN "version"
            SET DEFAULT '1'
        `);
        await queryRunner.query(`
            ALTER TABLE "pay_period"
            ALTER COLUMN "createdUserId" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "pay_period"
            ALTER COLUMN "updatedUserId" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "pay_period"
            ALTER COLUMN "version" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "pay_period"
            ALTER COLUMN "version"
            SET DEFAULT '1'
        `);
        await queryRunner.query(`
            ALTER TABLE "access"
            ALTER COLUMN "createdUserId" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "access"
            ALTER COLUMN "updatedUserId" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "access"
            ALTER COLUMN "version" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "access"
            ALTER COLUMN "version"
            SET DEFAULT '1'
        `);
        await queryRunner.query(`
            ALTER TABLE "user_company"
            ADD CONSTRAINT "FK_9c279d6cf291c858efa8a6b143f" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user_company" DROP CONSTRAINT "FK_9c279d6cf291c858efa8a6b143f"
        `);
        await queryRunner.query(`
            ALTER TABLE "access"
            ALTER COLUMN "version" DROP DEFAULT
        `);
        await queryRunner.query(`
            ALTER TABLE "access"
            ALTER COLUMN "version"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "access"
            ALTER COLUMN "updatedUserId"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "access"
            ALTER COLUMN "createdUserId"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "pay_period"
            ALTER COLUMN "version" DROP DEFAULT
        `);
        await queryRunner.query(`
            ALTER TABLE "pay_period"
            ALTER COLUMN "version"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "pay_period"
            ALTER COLUMN "updatedUserId"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "pay_period"
            ALTER COLUMN "createdUserId"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "company"
            ALTER COLUMN "version" DROP DEFAULT
        `);
        await queryRunner.query(`
            ALTER TABLE "company"
            ALTER COLUMN "version"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "company"
            ALTER COLUMN "updatedUserId"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "company"
            ALTER COLUMN "createdUserId"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "position"
            ALTER COLUMN "version" DROP DEFAULT
        `);
        await queryRunner.query(`
            ALTER TABLE "position"
            ALTER COLUMN "version"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "position"
            ALTER COLUMN "updatedUserId"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "position"
            ALTER COLUMN "createdUserId"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "position_history"
            ALTER COLUMN "version" DROP DEFAULT
        `);
        await queryRunner.query(`
            ALTER TABLE "position_history"
            ALTER COLUMN "version"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "position_history"
            ALTER COLUMN "updatedUserId"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "position_history"
            ALTER COLUMN "createdUserId"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "payment_type"
            ALTER COLUMN "version" DROP DEFAULT
        `);
        await queryRunner.query(`
            ALTER TABLE "payment_type"
            ALTER COLUMN "version"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "payment_type"
            ALTER COLUMN "updatedUserId"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "payment_type"
            ALTER COLUMN "createdUserId"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "job"
            ALTER COLUMN "version" DROP DEFAULT
        `);
        await queryRunner.query(`
            ALTER TABLE "job"
            ALTER COLUMN "version"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "job"
            ALTER COLUMN "updatedUserId"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "job"
            ALTER COLUMN "createdUserId"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "person"
            ALTER COLUMN "version" DROP DEFAULT
        `);
        await queryRunner.query(`
            ALTER TABLE "person"
            ALTER COLUMN "version"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "person"
            ALTER COLUMN "updatedUserId"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "person"
            ALTER COLUMN "createdUserId"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "department"
            ALTER COLUMN "version" DROP DEFAULT
        `);
        await queryRunner.query(`
            ALTER TABLE "department"
            ALTER COLUMN "version"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "department"
            ALTER COLUMN "updatedUserId"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "department"
            ALTER COLUMN "createdUserId"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "work_norm"
            ALTER COLUMN "version" DROP DEFAULT
        `);
        await queryRunner.query(`
            ALTER TABLE "work_norm"
            ALTER COLUMN "version"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "work_norm"
            ALTER COLUMN "updatedUserId"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "work_norm"
            ALTER COLUMN "createdUserId"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "work_norm_period"
            ALTER COLUMN "version" DROP DEFAULT
        `);
        await queryRunner.query(`
            ALTER TABLE "work_norm_period"
            ALTER COLUMN "version"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "work_norm_period"
            ALTER COLUMN "updatedUserId"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "work_norm_period"
            ALTER COLUMN "createdUserId"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "user_company" DROP COLUMN "version"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_company" DROP COLUMN "deletedUserId"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_company" DROP COLUMN "deletedDate"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_company" DROP COLUMN "updatedUserId"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_company" DROP COLUMN "updatedDate"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_company" DROP COLUMN "createdUserId"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_company" DROP COLUMN "createdDate"
        `);
        await queryRunner.query(`
            ALTER TABLE "accounting" DROP COLUMN "version"
        `);
        await queryRunner.query(`
            ALTER TABLE "accounting" DROP COLUMN "deletedUserId"
        `);
        await queryRunner.query(`
            ALTER TABLE "accounting" DROP COLUMN "deletedDate"
        `);
        await queryRunner.query(`
            ALTER TABLE "accounting" DROP COLUMN "updatedUserId"
        `);
        await queryRunner.query(`
            ALTER TABLE "accounting" DROP COLUMN "updatedDate"
        `);
        await queryRunner.query(`
            ALTER TABLE "accounting" DROP COLUMN "createdUserId"
        `);
        await queryRunner.query(`
            ALTER TABLE "accounting" DROP COLUMN "createdDate"
        `);
        await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "version"
        `);
        await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "deletedUserId"
        `);
        await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "deletedDate"
        `);
        await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "updatedUserId"
        `);
        await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "updatedDate"
        `);
        await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "createdUserId"
        `);
        await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "createdDate"
        `);
    }
}
