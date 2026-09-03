import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * role_type     | company_id
 * --------------|--------------
 * system        | **NULL only**
 * system-admin  | **NULL only**
 * company-admin | **NOT NULL**
 * accountant    | **NOT NULL**
 * employee      | **NOT NULL**
 * manager       | **NOT NULL**
 */
export class Seed1867489690322 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE OR REPLACE FUNCTION enforce_user_role_company_scope()
            RETURNS trigger AS $$
            DECLARE
                v_role_type TEXT;
            BEGIN
                SELECT r."type"::TEXT
                INTO v_role_type
                FROM roles r
                WHERE r.id = NEW.role_id;

                IF v_role_type in ('system', 'system-admin') AND NEW.company_id IS NOT NULL THEN
                    RAISE EXCEPTION
                        'system and system-admin role must NOT be assigned to a company';
                END IF;

                IF v_role_type not in ('system', 'system-admin') AND NEW.company_id IS NULL THEN
                    RAISE EXCEPTION
                        'non-system roles MUST be assigned to a company';
                END IF;

                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `);

        await queryRunner.query(`
            CREATE TRIGGER trg_user_roles_company_scope
            BEFORE INSERT OR UPDATE ON user_roles
            FOR EACH ROW
            EXECUTE FUNCTION enforce_user_role_company_scope();
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TRIGGER IF EXISTS trg_user_roles_company_scope ON user_roles`);
        await queryRunner.query(`DROP FUNCTION IF EXISTS enforce_user_role_company_scope`);
    }
}
