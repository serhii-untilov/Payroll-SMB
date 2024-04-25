import { MigrationInterface, QueryRunner } from 'typeorm';

export class Gen1712061950419 implements MigrationInterface {
    name = 'Gen1712061950419';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "work_norm_period" (
                "createdDate" TIMESTAMP NOT NULL DEFAULT now(),
                "createdUserId" integer NOT NULL,
                "updatedDate" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedUserId" integer NOT NULL,
                "deletedDate" TIMESTAMP,
                "deletedUserId" integer,
                "version" integer NOT NULL,
                "id" SERIAL NOT NULL,
                "workNormId" integer NOT NULL,
                "day" integer NOT NULL,
                "hours" numeric NOT NULL,
                CONSTRAINT "PK_6f37c7646e3b6bb4c5dca57ffd2" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "work_norm" (
                "createdDate" TIMESTAMP NOT NULL DEFAULT now(),
                "createdUserId" integer NOT NULL,
                "updatedDate" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedUserId" integer NOT NULL,
                "deletedDate" TIMESTAMP,
                "deletedUserId" integer,
                "version" integer NOT NULL,
                "id" SERIAL NOT NULL,
                "name" character varying(50) NOT NULL,
                "type" character varying(30) NOT NULL,
                "dateFrom" date NOT NULL DEFAULT '1900-01-01',
                "dateTo" date NOT NULL DEFAULT '9999-12-31',
                CONSTRAINT "PK_0c188d816c7060535103eba7d41" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "role" (
                "id" SERIAL NOT NULL,
                "name" character varying(50) NOT NULL,
                "type" character varying(15) NOT NULL DEFAULT 'guest',
                CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "user" (
                "id" SERIAL NOT NULL,
                "firstName" character varying(50) NOT NULL,
                "lastName" character varying(50) NOT NULL,
                "email" character varying(50) NOT NULL,
                "password" character varying(50) NOT NULL,
                "refreshToken" character varying,
                "isActive" boolean NOT NULL DEFAULT true,
                "language" character varying(5),
                "roleId" integer NOT NULL,
                CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "accounting" (
                "id" SERIAL NOT NULL,
                "name" character varying(50) NOT NULL,
                "type" character varying(15) NOT NULL DEFAULT 'generic',
                CONSTRAINT "PK_6a6f4091126bfca1743ad2eb14f" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "department" (
                "createdDate" TIMESTAMP NOT NULL DEFAULT now(),
                "createdUserId" integer NOT NULL,
                "updatedDate" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedUserId" integer NOT NULL,
                "deletedDate" TIMESTAMP,
                "deletedUserId" integer,
                "version" integer NOT NULL,
                "id" SERIAL NOT NULL,
                "name" character varying(50) NOT NULL,
                "companyId" integer NOT NULL,
                "dateFrom" date NOT NULL DEFAULT '1900-01-01',
                "dateTo" date NOT NULL DEFAULT '9999-12-31',
                "parentDepartmentId" integer,
                CONSTRAINT "PK_9a2213262c1593bffb581e382f5" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "law" (
                "id" SERIAL NOT NULL,
                "name" character varying(50) NOT NULL,
                "type" character varying(15) NOT NULL DEFAULT 'ukraine',
                CONSTRAINT "PK_5fb9289b907ae88d7f382e76793" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "company" (
                "createdDate" TIMESTAMP NOT NULL DEFAULT now(),
                "createdUserId" integer NOT NULL,
                "updatedDate" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedUserId" integer NOT NULL,
                "deletedDate" TIMESTAMP,
                "deletedUserId" integer,
                "version" integer NOT NULL,
                "id" SERIAL NOT NULL,
                "name" character varying(50) NOT NULL,
                "taxId" character varying(15) NOT NULL DEFAULT '',
                "lawId" integer,
                "accountingId" integer,
                "paymentSchedule" character varying(10) NOT NULL DEFAULT 'last-day',
                "dateFrom" date NOT NULL DEFAULT '1900-01-01',
                "dateTo" date NOT NULL DEFAULT '9999-12-31',
                "payPeriod" date NOT NULL,
                "checkDate" date NOT NULL,
                CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "user_company" (
                "id" SERIAL NOT NULL,
                "userId" integer NOT NULL,
                "companyId" integer NOT NULL,
                "roleId" integer NOT NULL,
                CONSTRAINT "PK_9e70b5f9d7095018e86970c7874" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "person" (
                "createdDate" TIMESTAMP NOT NULL DEFAULT now(),
                "createdUserId" integer NOT NULL,
                "updatedDate" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedUserId" integer NOT NULL,
                "deletedDate" TIMESTAMP,
                "deletedUserId" integer,
                "version" integer NOT NULL,
                "id" SERIAL NOT NULL,
                "firstName" character varying(30) NOT NULL,
                "lastName" character varying(30) NOT NULL,
                "middleName" character varying(30) NOT NULL DEFAULT '',
                "birthDate" date NOT NULL,
                "taxId" character varying(15) NOT NULL DEFAULT '',
                "sex" character varying(10) NOT NULL DEFAULT '',
                "phone" character varying(20) NOT NULL DEFAULT '',
                "email" character varying(50) NOT NULL DEFAULT '',
                "photo" character varying(260) NOT NULL DEFAULT '',
                CONSTRAINT "PK_5fdaf670315c4b7e70cce85daa3" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "job" (
                "createdDate" TIMESTAMP NOT NULL DEFAULT now(),
                "createdUserId" integer NOT NULL,
                "updatedDate" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedUserId" integer NOT NULL,
                "deletedDate" TIMESTAMP,
                "deletedUserId" integer,
                "version" integer NOT NULL,
                "id" SERIAL NOT NULL,
                "name" character varying(50) NOT NULL,
                CONSTRAINT "PK_98ab1c14ff8d1cf80d18703b92f" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "payment_type" (
                "createdDate" TIMESTAMP NOT NULL DEFAULT now(),
                "createdUserId" integer NOT NULL,
                "updatedDate" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedUserId" integer NOT NULL,
                "deletedDate" TIMESTAMP,
                "deletedUserId" integer,
                "version" integer NOT NULL,
                "id" SERIAL NOT NULL,
                "name" character varying(50) NOT NULL,
                "paymentGroup" character varying(30) NOT NULL,
                "paymentMethod" character varying(30) NOT NULL,
                CONSTRAINT "PK_4f301e328eaf2127773c889ab94" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "position_history" (
                "createdDate" TIMESTAMP NOT NULL DEFAULT now(),
                "createdUserId" integer NOT NULL,
                "updatedDate" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedUserId" integer NOT NULL,
                "deletedDate" TIMESTAMP,
                "deletedUserId" integer,
                "version" integer NOT NULL,
                "id" SERIAL NOT NULL,
                "positionId" integer NOT NULL,
                "dateFrom" date NOT NULL DEFAULT '1900-01-01',
                "dateTo" date NOT NULL DEFAULT '9999-12-31',
                "departmentId" integer,
                "jobId" integer,
                "workNormId" integer,
                "paymentTypeId" integer,
                "wage" numeric(15, 2) NOT NULL DEFAULT '0',
                "rate" numeric(4, 2) NOT NULL DEFAULT '1',
                CONSTRAINT "PK_a00ccfa0f04dec40b64bc2c795f" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "position" (
                "createdDate" TIMESTAMP NOT NULL DEFAULT now(),
                "createdUserId" integer NOT NULL,
                "updatedDate" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedUserId" integer NOT NULL,
                "deletedDate" TIMESTAMP,
                "deletedUserId" integer,
                "version" integer NOT NULL,
                "id" SERIAL NOT NULL,
                "firstName" character varying(30) NOT NULL,
                "companyId" integer NOT NULL,
                "cardNumber" character varying(15) NOT NULL,
                "sequenceNumber" integer NOT NULL,
                "description" character varying(260) NOT NULL,
                "personId" integer,
                "dateFrom" date NOT NULL DEFAULT '1900-01-01',
                "dateTo" date NOT NULL DEFAULT '9999-12-31',
                CONSTRAINT "PK_b7f483581562b4dc62ae1a5b7e2" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "pay_period" (
                "createdDate" TIMESTAMP NOT NULL DEFAULT now(),
                "createdUserId" integer NOT NULL,
                "updatedDate" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedUserId" integer NOT NULL,
                "deletedDate" TIMESTAMP,
                "deletedUserId" integer,
                "version" integer NOT NULL,
                "id" SERIAL NOT NULL,
                "companyId" integer NOT NULL,
                "dateFrom" date NOT NULL DEFAULT '1900-01-01',
                "dateTo" date NOT NULL DEFAULT '9999-12-31',
                "state" character varying(10) NOT NULL DEFAULT 'opened',
                "inBalance" numeric(15, 2) NOT NULL DEFAULT '0',
                "accrual" numeric(15, 2) NOT NULL DEFAULT '0',
                "deduction" numeric(15, 2) NOT NULL DEFAULT '0',
                "tax" numeric(15, 2) NOT NULL DEFAULT '0',
                "netPay" numeric(15, 2) NOT NULL DEFAULT '0',
                "payment" numeric(15, 2) NOT NULL DEFAULT '0',
                "outBalance" numeric(15, 2) NOT NULL DEFAULT '0',
                CONSTRAINT "PK_8d31a9974c177209559182034c0" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "work_norm_period"
            ADD CONSTRAINT "FK_eae1a1e0e6e8e62aa1f8875ad21" FOREIGN KEY ("workNormId") REFERENCES "work_norm"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "department"
            ADD CONSTRAINT "FK_1c9f0159b4ae69008bd356bb1ce" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "department"
            ADD CONSTRAINT "FK_bbe097728367bd569b5db49db90" FOREIGN KEY ("parentDepartmentId") REFERENCES "department"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "position_history"
            ADD CONSTRAINT "FK_79cd86fb242e01d5f2174ed8aa4" FOREIGN KEY ("positionId") REFERENCES "position"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "position"
            ADD CONSTRAINT "FK_4795972601ff1d8b498ebc3d031" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "position"
            ADD CONSTRAINT "FK_b562f463c12b61e6dab9bd44b9c" FOREIGN KEY ("personId") REFERENCES "person"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "pay_period"
            ADD CONSTRAINT "FK_584ecbca8afc0629d4283e63d6f" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "pay_period" DROP CONSTRAINT "FK_584ecbca8afc0629d4283e63d6f"
        `);
        await queryRunner.query(`
            ALTER TABLE "position" DROP CONSTRAINT "FK_b562f463c12b61e6dab9bd44b9c"
        `);
        await queryRunner.query(`
            ALTER TABLE "position" DROP CONSTRAINT "FK_4795972601ff1d8b498ebc3d031"
        `);
        await queryRunner.query(`
            ALTER TABLE "position_history" DROP CONSTRAINT "FK_79cd86fb242e01d5f2174ed8aa4"
        `);
        await queryRunner.query(`
            ALTER TABLE "department" DROP CONSTRAINT "FK_bbe097728367bd569b5db49db90"
        `);
        await queryRunner.query(`
            ALTER TABLE "department" DROP CONSTRAINT "FK_1c9f0159b4ae69008bd356bb1ce"
        `);
        await queryRunner.query(`
            ALTER TABLE "work_norm_period" DROP CONSTRAINT "FK_eae1a1e0e6e8e62aa1f8875ad21"
        `);
        await queryRunner.query(`
            DROP TABLE "pay_period"
        `);
        await queryRunner.query(`
            DROP TABLE "position"
        `);
        await queryRunner.query(`
            DROP TABLE "position_history"
        `);
        await queryRunner.query(`
            DROP TABLE "payment_type"
        `);
        await queryRunner.query(`
            DROP TABLE "job"
        `);
        await queryRunner.query(`
            DROP TABLE "person"
        `);
        await queryRunner.query(`
            DROP TABLE "user_company"
        `);
        await queryRunner.query(`
            DROP TABLE "company"
        `);
        await queryRunner.query(`
            DROP TABLE "law"
        `);
        await queryRunner.query(`
            DROP TABLE "department"
        `);
        await queryRunner.query(`
            DROP TABLE "accounting"
        `);
        await queryRunner.query(`
            DROP TABLE "user"
        `);
        await queryRunner.query(`
            DROP TABLE "role"
        `);
        await queryRunner.query(`
            DROP TABLE "work_norm"
        `);
        await queryRunner.query(`
            DROP TABLE "work_norm_period"
        `);
    }
}
