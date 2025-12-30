import { MigrationInterface, QueryRunner } from "typeorm";

export class Ddl1767056551797 implements MigrationInterface {
    name = 'Ddl1767056551797'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "work_norms" (
                "id" bigint NOT NULL,
                "created_date" TIMESTAMP NOT NULL DEFAULT now(),
                "created_user_id" bigint,
                "updated_date" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_user_id" bigint,
                "deleted_date" TIMESTAMP,
                "deleted_user_id" bigint,
                "version" integer NOT NULL DEFAULT '1',
                "name" character varying(50) NOT NULL,
                "type" character varying(30) NOT NULL DEFAULT 'weekly',
                "date_from" date NOT NULL DEFAULT '1900-01-01',
                "date_to" date NOT NULL DEFAULT '9999-12-31',
                CONSTRAINT "PK_8c4d44e3e0712ed6c357f01ebee" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "work_norm_periods" (
                "id" bigint NOT NULL,
                "created_date" TIMESTAMP NOT NULL DEFAULT now(),
                "created_user_id" bigint,
                "updated_date" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_user_id" bigint,
                "deleted_date" TIMESTAMP,
                "deleted_user_id" bigint,
                "version" integer NOT NULL DEFAULT '1',
                "work_norm_id" bigint NOT NULL,
                "day" integer NOT NULL,
                "hours" numeric(5, 2) NOT NULL,
                CONSTRAINT "PK_24aae24e6831dd9fe461b4c67b1" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "roles" (
                "id" bigint NOT NULL,
                "created_date" TIMESTAMP NOT NULL DEFAULT now(),
                "created_user_id" bigint,
                "updated_date" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_user_id" bigint,
                "deleted_date" TIMESTAMP,
                "deleted_user_id" bigint,
                "version" integer NOT NULL DEFAULT '1',
                "name" character varying(50) NOT NULL,
                "type" character varying(15) NOT NULL DEFAULT 'guest',
                CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" bigint NOT NULL,
                "created_date" TIMESTAMP NOT NULL DEFAULT now(),
                "created_user_id" bigint,
                "updated_date" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_user_id" bigint,
                "deleted_date" TIMESTAMP,
                "deleted_user_id" bigint,
                "version" integer NOT NULL DEFAULT '1',
                "first_name" character varying(50) NOT NULL,
                "last_name" character varying(50) NOT NULL,
                "email" character varying(50) NOT NULL,
                "password" character varying(60) NOT NULL,
                "refresh_token" character varying,
                "is_active" boolean NOT NULL DEFAULT true,
                "language" character varying(5),
                "role_id" bigint NOT NULL,
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "accountings" (
                "id" bigint NOT NULL,
                "created_date" TIMESTAMP NOT NULL DEFAULT now(),
                "created_user_id" bigint,
                "updated_date" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_user_id" bigint,
                "deleted_date" TIMESTAMP,
                "deleted_user_id" bigint,
                "version" integer NOT NULL DEFAULT '1',
                "name" character varying(50) NOT NULL,
                "type" character varying(15) NOT NULL DEFAULT 'generic',
                CONSTRAINT "PK_b17a36163dda1c07b10b644a7b8" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "departments" (
                "id" bigint NOT NULL,
                "created_date" TIMESTAMP NOT NULL DEFAULT now(),
                "created_user_id" bigint,
                "updated_date" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_user_id" bigint,
                "deleted_date" TIMESTAMP,
                "deleted_user_id" bigint,
                "version" integer NOT NULL DEFAULT '1',
                "name" character varying(50) NOT NULL,
                "company_id" bigint NOT NULL,
                "date_from" date NOT NULL DEFAULT '1900-01-01',
                "date_to" date NOT NULL DEFAULT '9999-12-31',
                "parent_department_id" bigint,
                CONSTRAINT "PK_839517a681a86bb84cbcc6a1e9d" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "laws" (
                "id" integer GENERATED BY DEFAULT AS IDENTITY NOT NULL,
                "name" character varying(50) NOT NULL,
                "type" character varying(15) NOT NULL DEFAULT 'ukraine',
                CONSTRAINT "PK_44cb27c4edaa03da5e06d635432" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "persons" (
                "id" bigint NOT NULL,
                "created_date" TIMESTAMP NOT NULL DEFAULT now(),
                "created_user_id" bigint,
                "updated_date" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_user_id" bigint,
                "deleted_date" TIMESTAMP,
                "deleted_user_id" bigint,
                "version" integer NOT NULL DEFAULT '1',
                "first_name" character varying(30) NOT NULL,
                "last_name" character varying(30) NOT NULL,
                "middle_name" character varying(30) NOT NULL DEFAULT '',
                "birthday" date,
                "tax_id" character varying(15) NOT NULL DEFAULT '',
                "sex" character varying(10) DEFAULT '',
                "phone" character varying(20) NOT NULL DEFAULT '',
                "email" character varying(50) NOT NULL DEFAULT '',
                "photo" character varying(260) NOT NULL DEFAULT '',
                CONSTRAINT "PK_74278d8812a049233ce41440ac7" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "jobs" (
                "id" bigint NOT NULL,
                "created_date" TIMESTAMP NOT NULL DEFAULT now(),
                "created_user_id" bigint,
                "updated_date" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_user_id" bigint,
                "deleted_date" TIMESTAMP,
                "deleted_user_id" bigint,
                "version" integer NOT NULL DEFAULT '1',
                "name" character varying(50) NOT NULL,
                CONSTRAINT "PK_cf0a6c42b72fcc7f7c237def345" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "payment_types" (
                "id" bigint NOT NULL,
                "created_date" TIMESTAMP NOT NULL DEFAULT now(),
                "created_user_id" bigint,
                "updated_date" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_user_id" bigint,
                "deleted_date" TIMESTAMP,
                "deleted_user_id" bigint,
                "version" integer NOT NULL DEFAULT '1',
                "name" character varying(50) NOT NULL,
                "payment_part" character varying(30) NOT NULL,
                "payment_group" character varying(30) NOT NULL,
                "calc_method" character varying(30) NOT NULL,
                "description" character varying(300) NOT NULL DEFAULT '',
                CONSTRAINT "PK_4f84450f9fd8116e201d806c74b" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "position_histories" (
                "id" bigint NOT NULL,
                "created_date" TIMESTAMP NOT NULL DEFAULT now(),
                "created_user_id" bigint,
                "updated_date" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_user_id" bigint,
                "deleted_date" TIMESTAMP,
                "deleted_user_id" bigint,
                "version" integer NOT NULL DEFAULT '1',
                "position_id" bigint NOT NULL,
                "date_from" date NOT NULL DEFAULT '1900-01-01',
                "date_to" date NOT NULL DEFAULT '9999-12-31',
                "department_id" bigint,
                "job_id" bigint,
                "work_norm_id" bigint,
                "payment_type_id" bigint,
                "wage" numeric(15, 2) NOT NULL DEFAULT '0',
                "rate" numeric(4, 2) NOT NULL DEFAULT '1',
                CONSTRAINT "PK_f84e0a713fdf765bcc11e6c7b63" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "position_balances" (
                "id" integer GENERATED BY DEFAULT AS IDENTITY NOT NULL,
                "position_id" bigint NOT NULL,
                "pay_period" date NOT NULL,
                "in_balance" numeric(15, 2) NOT NULL DEFAULT '0',
                "plan_days" integer NOT NULL DEFAULT '0',
                "plan_hours" numeric(15, 2) NOT NULL DEFAULT '0',
                "fact_days" integer NOT NULL DEFAULT '0',
                "fact_hours" numeric(15, 2) NOT NULL DEFAULT '0',
                "accruals" numeric(15, 2) NOT NULL DEFAULT '0',
                "deductions" numeric(15, 2) NOT NULL DEFAULT '0',
                "basic" numeric(15, 2) NOT NULL DEFAULT '0',
                "adjustments" numeric(15, 2) NOT NULL DEFAULT '0',
                "bonuses" numeric(15, 2) NOT NULL DEFAULT '0',
                "vacations" numeric(15, 2) NOT NULL DEFAULT '0',
                "sicks" numeric(15, 2) NOT NULL DEFAULT '0',
                "refunds" numeric(15, 2) NOT NULL DEFAULT '0',
                "other_accruals" numeric(15, 2) NOT NULL DEFAULT '0',
                "taxes" numeric(15, 2) NOT NULL DEFAULT '0',
                "payments" numeric(15, 2) NOT NULL DEFAULT '0',
                "other_deductions" numeric(15, 2) NOT NULL DEFAULT '0',
                "out_balance" numeric(15, 2) NOT NULL DEFAULT '0',
                CONSTRAINT "PK_7587b46eddca4a3b4e564e77db8" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_POSITION_BALANCE_POSITION_PERIOD" ON "position_balances" ("position_id", "pay_period")
        `);
        await queryRunner.query(`
            CREATE TABLE "positions" (
                "id" bigint NOT NULL,
                "created_date" TIMESTAMP NOT NULL DEFAULT now(),
                "created_user_id" bigint,
                "updated_date" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_user_id" bigint,
                "deleted_date" TIMESTAMP,
                "deleted_user_id" bigint,
                "version" integer NOT NULL DEFAULT '1',
                "company_id" bigint NOT NULL,
                "card_number" character varying(15) NOT NULL,
                "sequence_number" integer NOT NULL DEFAULT '2147483647',
                "description" character varying(260) NOT NULL DEFAULT '',
                "person_id" bigint,
                "date_from" date NOT NULL DEFAULT '1900-01-01',
                "date_to" date NOT NULL DEFAULT '9999-12-31',
                CONSTRAINT "PK_17e4e62ccd5749b289ae3fae6f3" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "companies" (
                "id" bigint NOT NULL,
                "created_date" TIMESTAMP NOT NULL DEFAULT now(),
                "created_user_id" bigint,
                "updated_date" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_user_id" bigint,
                "deleted_date" TIMESTAMP,
                "deleted_user_id" bigint,
                "version" integer NOT NULL DEFAULT '1',
                "name" character varying(50) NOT NULL,
                "tax_id" character varying(15) NOT NULL DEFAULT '',
                "law_id" integer,
                "accounting_id" bigint,
                "payment_schedule" character varying(10) NOT NULL DEFAULT 'last-day',
                "date_from" date NOT NULL DEFAULT '1900-01-01',
                "date_to" date NOT NULL DEFAULT '9999-12-31',
                "pay_period" date NOT NULL,
                "check_date" date NOT NULL,
                CONSTRAINT "PK_d4bc3e82a314fa9e29f652c2c22" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "user_companies" (
                "id" bigint NOT NULL,
                "created_date" TIMESTAMP NOT NULL DEFAULT now(),
                "created_user_id" bigint,
                "updated_date" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_user_id" bigint,
                "deleted_date" TIMESTAMP,
                "deleted_user_id" bigint,
                "version" integer NOT NULL DEFAULT '1',
                "user_id" bigint NOT NULL,
                "company_id" bigint NOT NULL,
                "role_id" bigint NOT NULL,
                CONSTRAINT "PK_f41bd3ea569c8c877b9a9063abb" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "tasks" (
                "id" bigint NOT NULL,
                "created_date" TIMESTAMP NOT NULL DEFAULT now(),
                "created_user_id" bigint,
                "updated_date" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_user_id" bigint,
                "deleted_date" TIMESTAMP,
                "deleted_user_id" bigint,
                "version" integer NOT NULL DEFAULT '1',
                "company_id" bigint NOT NULL,
                "type" character varying(30) NOT NULL,
                "date_from" date NOT NULL DEFAULT '1900-01-01',
                "date_to" date NOT NULL DEFAULT '9999-12-31',
                "sequence_number" integer NOT NULL,
                "status" character varying(15) NOT NULL,
                "entity_id" bigint,
                CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "payrolls" (
                "id" bigint NOT NULL,
                "created_date" TIMESTAMP NOT NULL DEFAULT now(),
                "created_user_id" bigint,
                "updated_date" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_user_id" bigint,
                "deleted_date" TIMESTAMP,
                "deleted_user_id" bigint,
                "version" integer NOT NULL DEFAULT '1',
                "position_id" bigint NOT NULL,
                "pay_period" date NOT NULL,
                "acc_period" date NOT NULL,
                "payment_type_id" bigint NOT NULL,
                "date_from" date NOT NULL,
                "date_to" date NOT NULL,
                "source_type" character varying(20) NOT NULL DEFAULT '',
                "source_id" bigint,
                "date_begin" date,
                "date_end" date,
                "plan_days" integer NOT NULL DEFAULT '0',
                "plan_hours" numeric(6, 2) NOT NULL DEFAULT '0',
                "plan_sum" numeric(15, 2) NOT NULL DEFAULT '0',
                "rate" numeric(6, 2) NOT NULL DEFAULT '0',
                "fact_days" integer NOT NULL DEFAULT '0',
                "fact_hours" numeric(6, 2) NOT NULL DEFAULT '0',
                "fact_sum" numeric(15, 2) NOT NULL DEFAULT '0',
                "mask1" integer NOT NULL DEFAULT '0',
                "mask2" integer NOT NULL DEFAULT '0',
                "record_flags" bigint NOT NULL,
                "fixed_flags" bigint NOT NULL DEFAULT '0',
                "plan_hours_by_day" jsonb,
                "fact_hours_by_day" jsonb,
                "parent_id" bigint,
                CONSTRAINT "PK_4fc19dcf3522661435565b5ecf3" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_PAYROLL_SOURCE_TYPE_ID" ON "payrolls" ("source_type", "source_id")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_PAYROLL_POSITION_PAY_PERIOD" ON "payrolls" ("position_id", "pay_period")
        `);
        await queryRunner.query(`
            CREATE TABLE "payment_positions" (
                "id" bigint NOT NULL,
                "created_date" TIMESTAMP NOT NULL DEFAULT now(),
                "created_user_id" bigint,
                "updated_date" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_user_id" bigint,
                "deleted_date" TIMESTAMP,
                "deleted_user_id" bigint,
                "version" integer NOT NULL DEFAULT '1',
                "payment_id" bigint NOT NULL,
                "position_id" bigint NOT NULL,
                "base_sum" numeric(15, 2) NOT NULL DEFAULT '0',
                "deductions" numeric(15, 2) NOT NULL DEFAULT '0',
                "pay_sum" numeric(15, 2) NOT NULL DEFAULT '0',
                "funds" numeric(15, 2) NOT NULL DEFAULT '0',
                "record_flags" bigint NOT NULL DEFAULT '0',
                CONSTRAINT "PK_db91ea5eb29d837f52fbf61f748" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "payments" (
                "id" bigint NOT NULL,
                "created_date" TIMESTAMP NOT NULL DEFAULT now(),
                "created_user_id" bigint,
                "updated_date" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_user_id" bigint,
                "deleted_date" TIMESTAMP,
                "deleted_user_id" bigint,
                "version" integer NOT NULL DEFAULT '1',
                "company_id" bigint NOT NULL,
                "pay_period" date NOT NULL,
                "acc_period" date NOT NULL,
                "doc_number" character varying(10) NOT NULL,
                "doc_date" date NOT NULL,
                "payment_type_id" bigint NOT NULL,
                "date_from" date NOT NULL,
                "date_to" date NOT NULL,
                "base_sum" numeric(15, 2) NOT NULL DEFAULT '0',
                "deductions" numeric(15, 2) NOT NULL DEFAULT '0',
                "pay_sum" numeric(15, 2) NOT NULL DEFAULT '0',
                "funds" numeric(15, 2) NOT NULL DEFAULT '0',
                "status" character varying(10) NOT NULL,
                "record_flags" bigint NOT NULL DEFAULT '0',
                "description" character varying(256) NOT NULL DEFAULT '',
                CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_PAYMENT_COMP_ACC_STATUS" ON "payments" ("company_id", "acc_period", "status")
        `);
        await queryRunner.query(`
            CREATE TABLE "pay_fund_types" (
                "id" bigint NOT NULL,
                "created_date" TIMESTAMP NOT NULL DEFAULT now(),
                "created_user_id" bigint,
                "updated_date" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_user_id" bigint,
                "deleted_date" TIMESTAMP,
                "deleted_user_id" bigint,
                "version" integer NOT NULL DEFAULT '1',
                "name" character varying(50) NOT NULL,
                "group" character varying(30) NOT NULL,
                "calc_method" character varying(30) NOT NULL,
                "sequence" integer NOT NULL,
                "description" character varying(300) NOT NULL DEFAULT '',
                CONSTRAINT "PK_9a4d5f7ffed9ed37a8fb2cb49dc" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "payment_funds" (
                "id" integer GENERATED BY DEFAULT AS IDENTITY NOT NULL,
                "payment_position_id" bigint NOT NULL,
                "pay_fund_type_id" bigint NOT NULL,
                "base_sum" numeric(15, 2) NOT NULL DEFAULT '0',
                "pay_sum" numeric(15, 2) NOT NULL DEFAULT '0',
                "record_flags" bigint NOT NULL DEFAULT '0',
                CONSTRAINT "PK_4f92030e9e5185814bc6740d294" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "payment_deductions" (
                "id" integer GENERATED BY DEFAULT AS IDENTITY NOT NULL,
                "payment_position_id" bigint NOT NULL,
                "payment_type_id" bigint NOT NULL,
                "base_sum" numeric(15, 2) NOT NULL DEFAULT '0',
                "pay_sum" numeric(15, 2) NOT NULL DEFAULT '0',
                "record_flags" bigint NOT NULL DEFAULT '0',
                CONSTRAINT "PK_146fb174da7153b9f8b10cb0d40" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "pay_period_calc_methods" (
                "id" integer GENERATED BY DEFAULT AS IDENTITY NOT NULL,
                "pay_period_id" bigint NOT NULL,
                "calc_method" character varying(30) NOT NULL,
                "fact_sum" numeric(15, 2) NOT NULL DEFAULT '0',
                CONSTRAINT "PK_6d891f04f79fefcce3b2dac58db" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "pay_periods" (
                "id" bigint NOT NULL,
                "created_date" TIMESTAMP NOT NULL DEFAULT now(),
                "created_user_id" bigint,
                "updated_date" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_user_id" bigint,
                "deleted_date" TIMESTAMP,
                "deleted_user_id" bigint,
                "version" integer NOT NULL DEFAULT '1',
                "company_id" bigint NOT NULL,
                "date_from" date NOT NULL DEFAULT '1900-01-01',
                "date_to" date NOT NULL DEFAULT '9999-12-31',
                "state" character varying(10) NOT NULL DEFAULT 'opened',
                "in_balance" numeric(15, 2) NOT NULL DEFAULT '0',
                "in_company_debt" numeric(15, 2) NOT NULL DEFAULT '0',
                "in_employee_debt" numeric(15, 2) NOT NULL DEFAULT '0',
                "accruals" numeric(15, 2) NOT NULL DEFAULT '0',
                "deductions" numeric(15, 2) NOT NULL DEFAULT '0',
                "basic" numeric(15, 2) NOT NULL DEFAULT '0',
                "adjustments" numeric(15, 2) NOT NULL DEFAULT '0',
                "bonuses" numeric(15, 2) NOT NULL DEFAULT '0',
                "vacations" numeric(15, 2) NOT NULL DEFAULT '0',
                "sicks" numeric(15, 2) NOT NULL DEFAULT '0',
                "refunds" numeric(15, 2) NOT NULL DEFAULT '0',
                "other_accruals" numeric(15, 2) NOT NULL DEFAULT '0',
                "taxes" numeric(15, 2) NOT NULL DEFAULT '0',
                "payments" numeric(15, 2) NOT NULL DEFAULT '0',
                "other_deductions" numeric(15, 2) NOT NULL DEFAULT '0',
                "out_balance" numeric(15, 2) NOT NULL DEFAULT '0',
                "out_company_debt" numeric(15, 2) NOT NULL DEFAULT '0',
                "out_employee_debt" numeric(15, 2) NOT NULL DEFAULT '0',
                "funds" numeric(15, 2) NOT NULL DEFAULT '0',
                CONSTRAINT "PK_1eb133b5947dd46710dc78b94d7" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "min_wages" (
                "id" bigint NOT NULL,
                "created_date" TIMESTAMP NOT NULL DEFAULT now(),
                "created_user_id" bigint,
                "updated_date" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_user_id" bigint,
                "deleted_date" TIMESTAMP,
                "deleted_user_id" bigint,
                "version" integer NOT NULL DEFAULT '1',
                "date_from" date NOT NULL DEFAULT '1900-01-01',
                "date_to" date NOT NULL DEFAULT '9999-12-31',
                "pay_sum" numeric(15, 2) NOT NULL DEFAULT '0',
                CONSTRAINT "PK_a05f3961736ab968bbd34fc58a0" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX "MIN_WAGE_DATE_FROM_INDEX" ON "min_wages" ("date_from", "date_to", "pay_sum")
        `);
        await queryRunner.query(`
            CREATE TABLE "pay_funds" (
                "id" integer GENERATED BY DEFAULT AS IDENTITY NOT NULL,
                "position_id" bigint NOT NULL,
                "pay_period" date NOT NULL,
                "acc_period" date NOT NULL,
                "pay_fund_type_id" bigint NOT NULL,
                "pay_fund_category" character varying(30) NOT NULL,
                "income_sum" numeric(15, 2) NOT NULL DEFAULT '0',
                "base_sum" numeric(15, 2) NOT NULL DEFAULT '0',
                "rate" numeric(6, 2) NOT NULL DEFAULT '0',
                "pay_sum" numeric(15, 2) NOT NULL DEFAULT '0',
                CONSTRAINT "PK_5f4cc1ef073a7599cd7be33f304" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "access" (
                "id" bigint NOT NULL,
                "created_date" TIMESTAMP NOT NULL DEFAULT now(),
                "created_user_id" bigint,
                "updated_date" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_user_id" bigint,
                "deleted_date" TIMESTAMP,
                "deleted_user_id" bigint,
                "version" integer NOT NULL DEFAULT '1',
                "role_type" character varying(20) NOT NULL,
                "resource" character varying(20) NOT NULL,
                "action" character varying(20) NOT NULL,
                CONSTRAINT "PK_e386259e6046c45ab06811584ed" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "work_norm_periods"
            ADD CONSTRAINT "fk_work_norm_periods_work_norm_id_work_norms" FOREIGN KEY ("work_norm_id") REFERENCES "work_norms"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "departments"
            ADD CONSTRAINT "fk_departments_company_id_companies" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "departments"
            ADD CONSTRAINT "fk_departments_parent_department_id_departments" FOREIGN KEY ("parent_department_id") REFERENCES "departments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "position_histories"
            ADD CONSTRAINT "fk_position_histories_position_id_positions" FOREIGN KEY ("position_id") REFERENCES "positions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "position_balances"
            ADD CONSTRAINT "fk_position_balances_position_id_positions" FOREIGN KEY ("position_id") REFERENCES "positions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "positions"
            ADD CONSTRAINT "fk_positions_company_id_companies" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "positions"
            ADD CONSTRAINT "fk_positions_person_id_persons" FOREIGN KEY ("person_id") REFERENCES "persons"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "user_companies"
            ADD CONSTRAINT "fk_user_companies_company_id_companies" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "payment_positions"
            ADD CONSTRAINT "fk_payment_positions_payment_id_payments" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "pay_period_calc_methods"
            ADD CONSTRAINT "fk_pay_period_calc_methods_pay_period_id_pay_periods" FOREIGN KEY ("pay_period_id") REFERENCES "pay_periods"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "pay_periods"
            ADD CONSTRAINT "fk_pay_periods_company_id_companies" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "pay_periods" DROP CONSTRAINT "fk_pay_periods_company_id_companies"
        `);
        await queryRunner.query(`
            ALTER TABLE "pay_period_calc_methods" DROP CONSTRAINT "fk_pay_period_calc_methods_pay_period_id_pay_periods"
        `);
        await queryRunner.query(`
            ALTER TABLE "payment_positions" DROP CONSTRAINT "fk_payment_positions_payment_id_payments"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_companies" DROP CONSTRAINT "fk_user_companies_company_id_companies"
        `);
        await queryRunner.query(`
            ALTER TABLE "positions" DROP CONSTRAINT "fk_positions_person_id_persons"
        `);
        await queryRunner.query(`
            ALTER TABLE "positions" DROP CONSTRAINT "fk_positions_company_id_companies"
        `);
        await queryRunner.query(`
            ALTER TABLE "position_balances" DROP CONSTRAINT "fk_position_balances_position_id_positions"
        `);
        await queryRunner.query(`
            ALTER TABLE "position_histories" DROP CONSTRAINT "fk_position_histories_position_id_positions"
        `);
        await queryRunner.query(`
            ALTER TABLE "departments" DROP CONSTRAINT "fk_departments_parent_department_id_departments"
        `);
        await queryRunner.query(`
            ALTER TABLE "departments" DROP CONSTRAINT "fk_departments_company_id_companies"
        `);
        await queryRunner.query(`
            ALTER TABLE "work_norm_periods" DROP CONSTRAINT "fk_work_norm_periods_work_norm_id_work_norms"
        `);
        await queryRunner.query(`
            DROP TABLE "access"
        `);
        await queryRunner.query(`
            DROP TABLE "pay_funds"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."MIN_WAGE_DATE_FROM_INDEX"
        `);
        await queryRunner.query(`
            DROP TABLE "min_wages"
        `);
        await queryRunner.query(`
            DROP TABLE "pay_periods"
        `);
        await queryRunner.query(`
            DROP TABLE "pay_period_calc_methods"
        `);
        await queryRunner.query(`
            DROP TABLE "payment_deductions"
        `);
        await queryRunner.query(`
            DROP TABLE "payment_funds"
        `);
        await queryRunner.query(`
            DROP TABLE "pay_fund_types"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_PAYMENT_COMP_ACC_STATUS"
        `);
        await queryRunner.query(`
            DROP TABLE "payments"
        `);
        await queryRunner.query(`
            DROP TABLE "payment_positions"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_PAYROLL_POSITION_PAY_PERIOD"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_PAYROLL_SOURCE_TYPE_ID"
        `);
        await queryRunner.query(`
            DROP TABLE "payrolls"
        `);
        await queryRunner.query(`
            DROP TABLE "tasks"
        `);
        await queryRunner.query(`
            DROP TABLE "user_companies"
        `);
        await queryRunner.query(`
            DROP TABLE "companies"
        `);
        await queryRunner.query(`
            DROP TABLE "positions"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_POSITION_BALANCE_POSITION_PERIOD"
        `);
        await queryRunner.query(`
            DROP TABLE "position_balances"
        `);
        await queryRunner.query(`
            DROP TABLE "position_histories"
        `);
        await queryRunner.query(`
            DROP TABLE "payment_types"
        `);
        await queryRunner.query(`
            DROP TABLE "jobs"
        `);
        await queryRunner.query(`
            DROP TABLE "persons"
        `);
        await queryRunner.query(`
            DROP TABLE "laws"
        `);
        await queryRunner.query(`
            DROP TABLE "departments"
        `);
        await queryRunner.query(`
            DROP TABLE "accountings"
        `);
        await queryRunner.query(`
            DROP TABLE "users"
        `);
        await queryRunner.query(`
            DROP TABLE "roles"
        `);
        await queryRunner.query(`
            DROP TABLE "work_norm_periods"
        `);
        await queryRunner.query(`
            DROP TABLE "work_norms"
        `);
    }

}
